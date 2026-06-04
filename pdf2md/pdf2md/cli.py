"""CLI entry point for pdf2md."""
from __future__ import annotations
import logging
import os
import sys
import time
from pathlib import Path

import click
from dotenv import load_dotenv
from .ocr import get_backend, EasyOCRBackend, ClaudeVisionBackend
from .processor import PDFProcessor, BatchProcessor
from rich.console import Console
from rich.live import Live
from rich.panel import Panel
from rich.progress import (
    BarColumn,
    MofNCompleteColumn,
    Progress,
    SpinnerColumn,
    TaskID,
    TextColumn,
    TimeElapsedColumn,
    TimeRemainingColumn,
)
from rich.table import Table
from rich.text import Text

load_dotenv()
console = Console()


def _setup_logging(verbose: bool):
    level = logging.DEBUG if verbose else logging.WARNING
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%H:%M:%S",
    )


def _make_progress() -> Progress:
    return Progress(
        SpinnerColumn(),
        TextColumn("[bold blue]{task.description}"),
        BarColumn(bar_width=40),
        MofNCompleteColumn(),
        TextColumn("•"),
        TimeElapsedColumn(),
        TextColumn("•"),
        TimeRemainingColumn(),
        console=console,
        transient=False,
    )


@click.group()
@click.version_option(version="1.0.0")
def main():
    """pdf2md — Convert Hindi CamScanner PDFs to Markdown with OCR."""
    pass


@main.command()
@click.argument("input", type=click.Path(exists=True))
@click.argument("output", type=click.Path())
@click.option(
    "--backend", "-b",
    type=click.Choice(["easyocr", "claude", "tesseract"], case_sensitive=False),
    default="easyocr",
    show_default=True,
    help="OCR backend to use.",
)
@click.option("--dpi", default=300, show_default=True, help="PDF render DPI. Higher = better OCR, slower.")
@click.option("--page-workers", default=4, show_default=True, help="Parallel page OCR workers.")
@click.option("--pdf-workers", default=1, show_default=True, help="Parallel PDFs to process simultaneously.")
@click.option("--force", "-f", is_flag=True, help="Re-process even if output already exists.")
@click.option("--recursive/--no-recursive", default=True, show_default=True, help="Search PDFs recursively.")
@click.option("--gpu/--no-gpu", default=False, help="Use GPU for EasyOCR (if available).")
@click.option("--verbose", "-v", is_flag=True, help="Verbose logging.")
def convert(input, output, backend, dpi, page_workers, pdf_workers, force, recursive, gpu, verbose):
    """
    Convert PDF(s) to Markdown files.

    INPUT can be a single PDF file or a directory of PDFs.
    OUTPUT is the output directory (created if needed).

    Examples:\n
      pdf2md convert ./pdfs ./output\n
      pdf2md convert scan.pdf ./output --backend claude\n
      pdf2md convert ./pdfs ./output --backend easyocr --gpu --dpi 400
    """
    _setup_logging(verbose)

    input_path = Path(input)
    output_dir = Path(output)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Validate backend availability
    try:
        ocr = get_backend(backend, gpu=gpu) if backend == "easyocr" else get_backend(backend)
    except ValueError as e:
        console.print(f"[red]Error:[/] {e}")
        sys.exit(1)

    if not ocr.is_available():
        if backend == "claude":
            console.print("[red]Claude backend requires ANTHROPIC_API_KEY environment variable.[/]")
            console.print("Set it: [bold]export ANTHROPIC_API_KEY=sk-ant-...[/]")
        elif backend == "easyocr":
            console.print("[red]EasyOCR not installed.[/] Run: [bold]pip install easyocr[/]")
        elif backend == "tesseract":
            console.print("[red]Tesseract not found.[/] Run: [bold]brew install tesseract tesseract-lang[/]")
        sys.exit(1)

    console.print(Panel.fit(
        f"[bold]pdf2md[/] — Hindi PDF → Markdown\n"
        f"Backend: [cyan]{backend}[/]  •  DPI: [cyan]{dpi}[/]  •  "
        f"Page workers: [cyan]{page_workers}[/]",
        title="Configuration",
        border_style="blue",
    ))

    # Collect PDFs
    if input_path.is_file():
        pdfs = [input_path]
        input_dir = input_path.parent
    else:
        bp_tmp = BatchProcessor(ocr, dpi=dpi, page_workers=page_workers)
        pdfs = bp_tmp.find_pdfs(input_path, recursive)
        input_dir = input_path

    if not pdfs:
        console.print(f"[yellow]No PDFs found in {input}[/]")
        sys.exit(0)

    console.print(f"Found [bold]{len(pdfs)}[/] PDF(s) to process\n")

    progress = _make_progress()
    pdf_task: TaskID = progress.add_task("[bold]Overall", total=len(pdfs))
    page_task: TaskID = progress.add_task("[dim]Current PDF pages", total=1, visible=False)

    start_time = time.time()
    results_list = []

    def page_cb(pdf_name, pdf_idx, total_pdfs, page_done, page_total):
        progress.update(page_task, description=f"[dim]{pdf_name[:40]}", total=page_total,
                        completed=page_done, visible=True)

    with progress:
        processor = PDFProcessor(ocr_backend=ocr, dpi=dpi, page_workers=page_workers)
        for idx, pdf in enumerate(pdfs):
            if input_path.is_file():
                out = output_dir / pdf.with_suffix(".md").name
            else:
                rel = pdf.relative_to(input_dir)
                out = output_dir / rel.with_suffix(".md")
            out.parent.mkdir(parents=True, exist_ok=True)

            progress.update(pdf_task, description=f"[bold]{pdf.name[:50]}")
            progress.reset(page_task)

            def _cb(done, total, _name=pdf.name, _idx=idx):
                page_cb(_name, _idx, len(pdfs), done, total)

            result = processor.process(pdf_path=pdf, output_path=out, force=force,
                                       progress_callback=_cb)
            results_list.append(result)
            progress.advance(pdf_task)

    elapsed = time.time() - start_time

    # Summary table
    table = Table(title="Results", show_lines=True)
    table.add_column("PDF", style="cyan", no_wrap=False, max_width=50)
    table.add_column("Pages", justify="right")
    table.add_column("Status", justify="center")
    table.add_column("Output")

    ok = fail = skip = 0
    for r in results_list:
        if r.error:
            status = Text("FAILED", style="bold red")
            fail += 1
        elif r.failed_pages:
            status = Text(f"PARTIAL ({len(r.failed_pages)} pg failed)", style="yellow")
            ok += 1
        elif r.processed_pages == r.total_pages and r.total_pages > 0:
            status = Text("OK", style="bold green")
            ok += 1
        else:
            status = Text("SKIPPED", style="dim")
            skip += 1

        table.add_row(
            r.pdf_path.name,
            str(r.total_pages),
            status,
            str(r.output_path.relative_to(output_dir)),
        )

    console.print()
    console.print(table)
    console.print(
        f"\n[bold green]✓ {ok}[/] done  "
        f"[bold red]✗ {fail}[/] failed  "
        f"[dim]{skip} skipped[/]  "
        f"— {elapsed:.1f}s elapsed"
    )

    if fail > 0:
        sys.exit(1)


@main.command()
@click.argument("pdf", type=click.Path(exists=True))
@click.option("--backend", "-b", type=click.Choice(["easyocr", "claude", "tesseract"]), default="easyocr")
@click.option("--page", "-p", default=0, help="Page number to test (0-indexed).")
@click.option("--dpi", default=300)
@click.option("--gpu/--no-gpu", default=False)
def test_page(pdf, backend, page, dpi, gpu):
    """
    Run OCR on a single page of a PDF — useful for tuning settings.

    Example:\n
      pdf2md test-page scan.pdf --page 5 --backend claude
    """
    ocr = get_backend(backend, gpu=gpu) if backend == "easyocr" else get_backend(backend)
    if not ocr.is_available():
        console.print(f"[red]Backend '{backend}' not available.[/]")
        sys.exit(1)

    from pdf2image import convert_from_path
    console.print(f"Rendering page {page} of [cyan]{pdf}[/] at {dpi} DPI...")
    images = convert_from_path(pdf, dpi=dpi, first_page=page + 1, last_page=page + 1)
    if not images:
        console.print(f"[red]Page {page} not found in PDF.[/]")
        sys.exit(1)

    console.print(f"Running OCR with [cyan]{backend}[/]...")
    result = ocr.extract_text(images[0], page_num=page)

    console.print(Panel(
        result.text if result.text.strip() else "[dim](no text detected)[/]",
        title=f"Page {page} — confidence: {result.confidence:.2%}",
        border_style="green" if result.text.strip() else "yellow",
    ))


@main.command()
def backends():
    """List available OCR backends and their status."""
    table = Table(title="OCR Backends")
    table.add_column("Backend", style="bold")
    table.add_column("Available", justify="center")
    table.add_column("Notes")

    checks = [
        ("easyocr", EasyOCRBackend(), "Free, offline, ~500MB models. Good Hindi accuracy."),
        ("claude", ClaudeVisionBackend(), "Best accuracy. Requires ANTHROPIC_API_KEY. ~$0.01/page."),
    ]

    try:
        from .ocr.tesseract_backend import TesseractBackend
        checks.insert(1, ("tesseract", TesseractBackend(), "Free, offline. Needs brew install tesseract tesseract-lang."))
    except ImportError:
        pass

    for name, backend, notes in checks:
        avail = backend.is_available()
        status = Text("✓ Ready", style="green") if avail else Text("✗ Not ready", style="red")
        table.add_row(name, status, notes)

    console.print(table)
