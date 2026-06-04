# pdf2md — Hindi PDF → Markdown

Convert 100s of CamScanner PDFs (with 100+ pages each) to Markdown files, with full Hindi (Devanagari) OCR.

## Features

- **Three OCR backends** — EasyOCR (free/offline), Claude Vision (best accuracy), Tesseract (optional)
- **Parallel processing** — pages processed concurrently, configurable workers
- **Resume** — interrupted runs pick up where they left off (per-page state file)
- **Mirror directory structure** — `input/topic/scan.pdf` → `output/topic/scan.md`
- **Rich progress UI** — live progress bars per PDF and per page
- **Markdown output** — each page as `## Page N` section, headings preserved where detected

## Quick Start

```bash
# 1. Install
./install.sh

# 2. Check what OCR backends are ready
pdf2md backends

# 3. Convert a whole folder
pdf2md convert ./my-pdfs ./output

# 4. Use Claude Vision for best Hindi accuracy
export ANTHROPIC_API_KEY=sk-ant-...
pdf2md convert ./my-pdfs ./output --backend claude

# 5. Test a single page before batch processing
pdf2md test-page scan.pdf --page 0 --backend claude
```

## OCR Backends

| Backend | Accuracy | Cost | Internet Required |
|---------|----------|------|-------------------|
| `easyocr` (default) | Good | Free | No (models download once ~500MB) |
| `claude` | Best | ~$0.01/page | Yes (API) |
| `tesseract` | Fair | Free | No |

**Recommendation for CamScanner Hindi PDFs:**
- Use `claude` for critical materials where accuracy matters most
- Use `easyocr` for bulk processing where cost is a concern
- Both can be run — process with `easyocr` first, reprocess specific PDFs with `claude` using `--force`

## CLI Reference

### `pdf2md convert`

```
pdf2md convert INPUT OUTPUT [OPTIONS]

  INPUT   Single PDF file OR directory of PDFs
  OUTPUT  Output directory (created if needed)

Options:
  --backend, -b    easyocr | claude | tesseract  [default: easyocr]
  --dpi            Render DPI (higher = better OCR, slower)  [default: 300]
  --page-workers   Parallel page OCR threads  [default: 4]
  --pdf-workers    Parallel PDFs to process  [default: 1]
  --force, -f      Re-process even if output .md already exists
  --recursive      Search for PDFs recursively  [default: True]
  --gpu            Use GPU for EasyOCR (if CUDA available)
  --verbose, -v    Verbose logging
```

### `pdf2md test-page`

```
pdf2md test-page PDF [OPTIONS]

Test OCR on a single page — useful before batch processing.

Options:
  --backend, -b    easyocr | claude | tesseract
  --page, -p       Page number (0-indexed)  [default: 0]
  --dpi            Render DPI  [default: 300]
```

### `pdf2md backends`

List all OCR backends and whether they're ready.

## Output Format

Each PDF becomes a `.md` file with this structure:

```markdown
# Pdf Filename Title

## Page 1

नमस्ते। यह पहला पृष्ठ है।

## Page 2

This is page two content...

## Page 3

> ⚠️ OCR Error: GPU crashed   ← error pages noted inline
```

## Resume / Partial Processing

If a run is interrupted, a `.pdf2md.json` state file is written alongside the output `.md`. On next run, completed pages are loaded from the existing `.md` and only pending pages are re-processed. The state file is deleted on successful completion.

To force full reprocessing: `pdf2md convert ... --force`

## Installation Details

### Requirements

- macOS / Linux
- Python 3.9+
- poppler (for pdf2image): `brew install poppler`

### Backends

**EasyOCR** (recommended default):
```bash
pip install easyocr
# Models (~500MB) auto-download on first use
```

**Claude Vision** (best accuracy):
```bash
pip install anthropic
export ANTHROPIC_API_KEY=sk-ant-...
```

**Tesseract** (optional):
```bash
brew install tesseract tesseract-lang
pip install pytesseract
```

## Performance Tips

- **DPI 300** is the sweet spot for CamScanner PDFs (default)
- **DPI 400** if text is small or images are low quality
- **page-workers 4** is safe for EasyOCR on CPU; try 8 if you have >8 cores
- **GPU** (`--gpu`) provides 5-10x speedup for EasyOCR if CUDA is available
- **claude** backend: rate limited to ~50 req/min; the app handles retries automatically
- Process one PDF with `test-page` first to validate output quality before batch

## Development

```bash
# Install with dev deps
pip install -e ".[dev]"

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=pdf2md --cov-report=term-missing
```

## Architecture

```
pdf2md/
├── cli.py              # Click CLI entry point
├── processor.py        # PDFProcessor (single PDF) + BatchProcessor (directory)
└── ocr/
    ├── base.py         # OCRBackend abstract class + OCRResult dataclass
    ├── easyocr_backend.py   # EasyOCR (offline, Hindi + English)
    ├── claude_backend.py    # Claude Vision API
    └── tesseract_backend.py # Tesseract (optional)
```
