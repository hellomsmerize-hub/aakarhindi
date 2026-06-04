"""Tests for PDF processor pipeline."""
import json
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
from PIL import Image

from pdf2md.ocr.base import OCRResult
from pdf2md.processor import PDFProcessor, BatchProcessor, PageResult, PDFResult


def make_mock_ocr(text: str = "नमस्ते", confidence: float = 0.95) -> MagicMock:
    backend = MagicMock()
    backend.extract_text.return_value = OCRResult(text=text, confidence=confidence)
    return backend


def make_images(n: int = 3) -> list[Image.Image]:
    return [Image.new("RGB", (100, 100), "white") for _ in range(n)]


class TestPageResult:
    def test_succeeded_no_error(self):
        r = PageResult(page_num=0, text="text", confidence=0.9)
        assert r.succeeded

    def test_succeeded_with_error(self):
        r = PageResult(page_num=0, text="", confidence=0.0, error="fail")
        assert not r.succeeded


class TestPDFResult:
    def test_succeeded(self):
        r = PDFResult(pdf_path=Path("a.pdf"), output_path=Path("a.md"),
                      total_pages=5, processed_pages=5)
        assert r.succeeded

    def test_partial(self):
        r = PDFResult(pdf_path=Path("a.pdf"), output_path=Path("a.md"),
                      total_pages=5, processed_pages=4, failed_pages=[2])
        assert r.partial
        assert not r.succeeded

    def test_failed(self):
        r = PDFResult(pdf_path=Path("a.pdf"), output_path=Path("a.md"),
                      total_pages=0, processed_pages=0, error="boom")
        assert not r.succeeded
        assert not r.partial


class TestPDFProcessor:
    def _make_processor(self, ocr=None):
        return PDFProcessor(
            ocr_backend=ocr or make_mock_ocr(),
            dpi=72,
            page_workers=1,
        )

    def test_results_to_markdown_structure(self, tmp_path):
        processor = self._make_processor()
        pdf_path = Path("test_doc.pdf")
        results = [
            PageResult(page_num=0, text="पहला पृष्ठ", confidence=0.9),
            PageResult(page_num=1, text="दूसरा पृष्ठ", confidence=0.85),
        ]
        md = processor._results_to_markdown(pdf_path, results)
        assert "# Test Doc" in md
        assert "## Page 1" in md
        assert "## Page 2" in md
        assert "पहला पृष्ठ" in md
        assert "दूसरा पृष्ठ" in md

    def test_results_to_markdown_error_page(self, tmp_path):
        processor = self._make_processor()
        results = [
            PageResult(page_num=0, text="", confidence=0.0, error="OCR crashed"),
        ]
        md = processor._results_to_markdown(Path("doc.pdf"), results)
        assert "OCR Error" in md
        assert "OCR crashed" in md

    def test_results_to_markdown_empty_page(self):
        processor = self._make_processor()
        results = [PageResult(page_num=0, text="   ", confidence=0.0)]
        md = processor._results_to_markdown(Path("doc.pdf"), results)
        assert "No text detected" in md

    def test_process_skips_existing_output(self, tmp_path):
        out = tmp_path / "out.md"
        out.write_text("# Existing\n\n## Page 1\n\nOld content\n")
        ocr = make_mock_ocr()
        processor = self._make_processor(ocr)

        with patch.object(processor, "_pdf_to_images") as mock_render:
            result = processor.process(Path("in.pdf"), out, force=False)

        mock_render.assert_not_called()
        assert result.succeeded

    def test_process_force_reprocesses(self, tmp_path):
        out = tmp_path / "out.md"
        out.write_text("# Old\n")
        ocr = make_mock_ocr()
        processor = self._make_processor(ocr)

        with patch.object(processor, "_pdf_to_images", return_value=make_images(2)):
            result = processor.process(Path("in.pdf"), out, force=True)

        assert "नमस्ते" in out.read_text()

    def test_process_handles_ocr_error(self, tmp_path):
        out = tmp_path / "out.md"
        failing_ocr = MagicMock()
        failing_ocr.extract_text.side_effect = RuntimeError("GPU exploded")
        processor = self._make_processor(failing_ocr)

        with patch.object(processor, "_pdf_to_images", return_value=make_images(1)):
            result = processor.process(Path("in.pdf"), out, force=True)

        assert result.failed_pages == [0]
        assert "GPU exploded" in out.read_text()

    def test_process_calls_progress_callback(self, tmp_path):
        out = tmp_path / "out.md"
        ocr = make_mock_ocr()
        processor = self._make_processor(ocr)
        calls = []

        with patch.object(processor, "_pdf_to_images", return_value=make_images(3)):
            processor.process(Path("in.pdf"), out, force=True,
                              progress_callback=lambda d, t: calls.append((d, t)))

        assert len(calls) == 3
        assert calls[-1][0] == 3  # final call: all pages done

    def test_process_creates_output_dir(self, tmp_path):
        nested = tmp_path / "a" / "b" / "c" / "out.md"
        ocr = make_mock_ocr()
        processor = self._make_processor(ocr)

        with patch.object(processor, "_pdf_to_images", return_value=make_images(1)):
            processor.process(Path("in.pdf"), nested, force=True)

        assert nested.exists()

    def test_state_file_written_and_cleared(self, tmp_path):
        out = tmp_path / "out.md"
        ocr = make_mock_ocr()
        processor = self._make_processor(ocr)

        with patch.object(processor, "_pdf_to_images", return_value=make_images(2)):
            processor.process(Path("in.pdf"), out, force=True)

        state_file = out.with_suffix(".pdf2md.json")
        # State file cleared after success
        assert not state_file.exists()

    def test_extract_page_from_md(self):
        processor = self._make_processor()
        md = "# Doc\n\n## Page 1\n\nनमस्ते\n\n## Page 2\n\nHello\n"
        text = processor._extract_page_from_md(md, page_num=0)
        assert text == "नमस्ते"
        text2 = processor._extract_page_from_md(md, page_num=1)
        assert text2 == "Hello"


class TestBatchProcessor:
    def test_find_pdfs_recursive(self, tmp_path):
        (tmp_path / "a.pdf").touch()
        (tmp_path / "sub").mkdir()
        (tmp_path / "sub" / "b.pdf").touch()
        (tmp_path / "not_a_pdf.txt").touch()

        processor = BatchProcessor(make_mock_ocr())
        pdfs = processor.find_pdfs(tmp_path, recursive=True)
        assert len(pdfs) == 2
        assert all(p.suffix == ".pdf" for p in pdfs)

    def test_find_pdfs_non_recursive(self, tmp_path):
        (tmp_path / "a.pdf").touch()
        (tmp_path / "sub").mkdir()
        (tmp_path / "sub" / "b.pdf").touch()

        processor = BatchProcessor(make_mock_ocr())
        pdfs = processor.find_pdfs(tmp_path, recursive=False)
        assert len(pdfs) == 1

    def test_get_output_path_mirrors_structure(self, tmp_path):
        input_dir = tmp_path / "input"
        output_dir = tmp_path / "output"
        pdf = input_dir / "sub" / "doc.pdf"

        processor = BatchProcessor(make_mock_ocr())
        out = processor.get_output_path(pdf, input_dir, output_dir)
        assert out == output_dir / "sub" / "doc.md"

    def test_process_all_empty_dir(self, tmp_path):
        input_dir = tmp_path / "in"
        input_dir.mkdir()
        output_dir = tmp_path / "out"

        processor = BatchProcessor(make_mock_ocr())
        results = processor.process_all(input_dir, output_dir)
        assert results == []

    def test_process_all_calls_page_processor(self, tmp_path):
        input_dir = tmp_path / "in"
        input_dir.mkdir()
        (input_dir / "test.pdf").touch()
        output_dir = tmp_path / "out"

        ocr = make_mock_ocr()
        processor = BatchProcessor(ocr)

        with patch.object(processor._page_processor, "_pdf_to_images",
                          return_value=make_images(2)):
            results = processor.process_all(input_dir, output_dir)

        assert len(results) == 1
        assert results[0].pdf_path.name == "test.pdf"
