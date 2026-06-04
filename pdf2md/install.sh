#!/usr/bin/env bash
# pdf2md installer — sets up OCR dependencies + Python package
set -euo pipefail

echo "=== pdf2md installer ==="
echo ""

# Detect macOS
if [[ "$(uname)" != "Darwin" ]]; then
    echo "Note: This script targets macOS. On Linux, replace brew commands with apt-get."
fi

# Check brew
if ! command -v brew &>/dev/null; then
    echo "Homebrew not found. Install from https://brew.sh"
    exit 1
fi

# Poppler (needed by pdf2image)
if ! brew list poppler &>/dev/null 2>&1; then
    echo "Installing poppler..."
    brew install poppler
else
    echo "✓ poppler already installed"
fi

# Optional: Tesseract (not required if using easyocr/claude)
read -rp "Install Tesseract (optional, needed for --backend tesseract)? [y/N] " install_tess
if [[ "${install_tess,,}" == "y" ]]; then
    brew install tesseract tesseract-lang
    echo "✓ Tesseract + Hindi lang pack installed"
fi

# Python deps
echo ""
echo "Installing Python dependencies..."
pip3 install --user numpy pdf2image Pillow easyocr anthropic click rich tqdm python-dotenv
pip3 install --user pytest pytest-cov pytest-mock

echo ""
echo "=== Setup complete ==="
echo ""
echo "Quick start:"
echo "  pdf2md backends                          # check what's available"
echo "  pdf2md convert ./pdfs ./output           # EasyOCR (default, offline)"
echo "  pdf2md convert ./pdfs ./output --backend claude   # Claude Vision (best accuracy)"
echo ""
echo "For Claude backend:"
echo "  export ANTHROPIC_API_KEY=sk-ant-..."
echo "  # Or create .env file with: ANTHROPIC_API_KEY=sk-ant-..."
echo ""
echo "Run tests:"
echo "  pytest tests/ -v"
