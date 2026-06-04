"""Core PDF → Markdown processing pipeline."""
from __future__ import annotations
import json
import logging
import re
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Optional, Callable

from PIL import Image

from .ocr.base import OCRBackend, OCRResult

logger = logging.getLogger(__name__)


@dataclass
class PageResult:
    page_num: int
    text: str
    confidence: float
    error: Optional[str] = None

    @property
    def succeeded(self) -> bool:
        return self.error is None


@dataclass
class PDFResult:
    pdf_path: Path
    output_path: Path
    total_pages: int
    processed_pages: int
    failed_pages: list[int] = field(default_factory=list)
    error: Optional[str] = None

    @property
    def succeeded(self) -> bool:
        return self.error is None and len(self.failed_pages) == 0

    @property
    def partial(self) -> bool:
        return self.error is None and len(self.failed_pages) > 0


class PDFProcessor:
    """
    Converts a single PDF to Markdown using an OCR backend.

    Features:
    - Parallel page processing (configurable workers)
    - Resume: skips PDFs whose .md output already exists (unless force=True)
    - Progress callback for UI integration
    - State file to track partial failures
    """

    def __init__(
        self,
        ocr_backend: OCRBackend,
        dpi: int = 300,
        page_workers: int = 4,
        image_format: str = "JPEG",
    ):
        self._ocr = ocr_backend
        self._dpi = dpi
        self._page_workers = page_workers
        self._image_format = image_format
        self._lock = threading.Lock()

    def _pdf_to_images(self, pdf_path: Path) -> list[Image.Image]:
        """Convert PDF pages to PIL Images."""
        from pdf2image import convert_from_path
        images = convert_from_path(
            str(pdf_path),
            dpi=self._dpi,
            fmt=self._image_format,
            thread_count=min(4, self._page_workers),
        )
        return images

    def _process_page(self, image: Image.Image, page_num: int) -> PageResult:
        try:
            result: OCRResult = self._ocr.extract_text(image, page_num)
            return PageResult(
                page_num=page_num,
                text=result.text,
                confidence=result.confidence,
            )
        except Exception as e:
            logger.error(f"Page {page_num} OCR failed: {e}")
            return PageResult(page_num=page_num, text="", confidence=0.0,
                              error=str(e))

    def _results_to_markdown(self, pdf_path: Path, results: list[PageResult]) -> str:
        """Assemble per-page OCR results into a Markdown document."""
        title = pdf_path.stem.replace("_", " ").replace("-", " ").title()
        lines = [f"# {title}", ""]

        for r in sorted(results, key=lambda x: x.page_num):
            lines.append(f"## Page {r.page_num + 1}")
            lines.append("")
            if r.error:
                lines.append(f"> ⚠️ OCR Error: {r.error}")
            elif r.text.strip():
                lines.append(r.text.strip())
            else:
                lines.append("> *(No text detected on this page)*")
            lines.append("")

        return "\n".join(lines)

    def _state_path(self, output_path: Path) -> Path:
        return output_path.with_suffix(".pdf2md.json")

    def _load_state(self, output_path: Path) -> set[int]:
        """Return set of already-completed page numbers (for resume)."""
        sp = self._state_path(output_path)
        if sp.exists():
            try:
                data = json.loads(sp.read_text())
                return set(data.get("completed_pages", []))
            except Exception:
                pass
        return set()

    def _save_state(self, output_path: Path, completed: set[int], total: int):
        sp = self._state_path(output_path)
        sp.write_text(json.dumps({
            "completed_pages": sorted(completed),
            "total_pages": total,
        }))

    def _clear_state(self, output_path: Path):
        sp = self._state_path(output_path)
        if sp.exists():
            sp.unlink()

    def process(
        self,
        pdf_path: Path,
        output_path: Path,
        force: bool = False,
        progress_callback: Optional[Callable[[int, int], None]] = None,
    ) -> PDFResult:
        """
        Convert pdf_path → output_path (.md).
        progress_callback(completed_pages, total_pages) called after each page.
        """
        if not force and output_path.exists():
            logger.info(f"Skipping {pdf_path.name} — output exists (use --force to redo)")
            # Count pages in existing file for accurate reporting
            content = output_path.read_text()
            total = content.count("## Page ")
            return PDFResult(
                pdf_path=pdf_path,
                output_path=output_path,
                total_pages=total,
                processed_pages=total,
            )

        logger.info(f"Converting {pdf_path.name}")
        output_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            images = self._pdf_to_images(pdf_path)
        except Exception as e:
            return PDFResult(
                pdf_path=pdf_path,
                output_path=output_path,
                total_pages=0,
                processed_pages=0,
                error=f"PDF render failed: {e}",
            )

        total = len(images)
        already_done = self._load_state(output_path)
        results: dict[int, PageResult] = {}
        completed_count = len(already_done)
        failed_pages = []

        # Load partial results from existing .md if resuming
        if already_done and output_path.exists():
            existing_md = output_path.read_text()
            for page_num in already_done:
                text = self._extract_page_from_md(existing_md, page_num)
                results[page_num] = PageResult(page_num=page_num, text=text, confidence=1.0)

        pages_to_process = [i for i in range(total) if i not in already_done]

        with ThreadPoolExecutor(max_workers=self._page_workers) as executor:
            future_to_page = {
                executor.submit(self._process_page, images[i], i): i
                for i in pages_to_process
            }

            for future in as_completed(future_to_page):
                page_result = future.result()
                with self._lock:
                    results[page_result.page_num] = page_result
                    if page_result.error:
                        failed_pages.append(page_result.page_num)
                    else:
                        already_done.add(page_result.page_num)
                    completed_count += 1
                    self._save_state(output_path, already_done, total)

                if progress_callback:
                    progress_callback(completed_count, total)

        # Write markdown
        all_results = list(results.values())
        markdown = self._results_to_markdown(pdf_path, all_results)
        output_path.write_text(markdown, encoding="utf-8")
        self._clear_state(output_path)

        return PDFResult(
            pdf_path=pdf_path,
            output_path=output_path,
            total_pages=total,
            processed_pages=len([r for r in all_results if r.succeeded]),
            failed_pages=sorted(failed_pages),
        )

    def _extract_page_from_md(self, md_content: str, page_num: int) -> str:
        """Extract previously-saved page text from a partial Markdown file."""
        pattern = rf"## Page {page_num + 1}\n\n(.*?)(?=\n## Page |\Z)"
        m = re.search(pattern, md_content, re.DOTALL)
        return m.group(1).strip() if m else ""


class BatchProcessor:
    """
    Process a directory of PDFs → Markdown files.
    Discovers all PDFs, processes in parallel (one PDF at a time by default
    to avoid memory overload), and reports summary.
    """

    def __init__(
        self,
        ocr_backend: OCRBackend,
        dpi: int = 300,
        page_workers: int = 4,
        pdf_workers: int = 1,
    ):
        self._page_processor = PDFProcessor(
            ocr_backend=ocr_backend,
            dpi=dpi,
            page_workers=page_workers,
        )
        self._pdf_workers = pdf_workers

    def find_pdfs(self, input_dir: Path, recursive: bool = True) -> list[Path]:
        if recursive:
            return sorted(input_dir.rglob("*.pdf"))
        return sorted(input_dir.glob("*.pdf"))

    def get_output_path(self, pdf_path: Path, input_dir: Path, output_dir: Path) -> Path:
        """Mirror directory structure: input/a/b.pdf → output/a/b.md"""
        rel = pdf_path.relative_to(input_dir)
        return output_dir / rel.with_suffix(".md")

    def process_all(
        self,
        input_dir: Path,
        output_dir: Path,
        force: bool = False,
        recursive: bool = True,
        progress_callback: Optional[Callable[[str, int, int, int, int], None]] = None,
    ) -> list[PDFResult]:
        """
        progress_callback(pdf_name, pdf_idx, total_pdfs, page_done, page_total)
        """
        pdfs = self.find_pdfs(input_dir, recursive)
        if not pdfs:
            logger.warning(f"No PDFs found in {input_dir}")
            return []

        results = []
        total_pdfs = len(pdfs)

        def _process_one(args):
            idx, pdf = args
            out = self.get_output_path(pdf, input_dir, output_dir)

            def page_cb(done, total):
                if progress_callback:
                    progress_callback(pdf.name, idx, total_pdfs, done, total)

            return self._page_processor.process(
                pdf_path=pdf,
                output_path=out,
                force=force,
                progress_callback=page_cb,
            )

        if self._pdf_workers == 1:
            for idx, pdf in enumerate(pdfs):
                r = _process_one((idx, pdf))
                results.append(r)
        else:
            with ThreadPoolExecutor(max_workers=self._pdf_workers) as executor:
                futures = {executor.submit(_process_one, (i, p)): p
                           for i, p in enumerate(pdfs)}
                for f in as_completed(futures):
                    results.append(f.result())

        return results
