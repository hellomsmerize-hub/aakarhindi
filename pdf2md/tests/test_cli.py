"""Tests for CLI commands."""
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
from click.testing import CliRunner
from PIL import Image

from pdf2md.cli import main
from pdf2md.processor import PDFResult


@pytest.fixture
def runner():
    return CliRunner()


def make_pdf_result(name="test.pdf", total=5, processed=5, failed=None, error=None):
    return PDFResult(
        pdf_path=Path(name),
        output_path=Path(name.replace(".pdf", ".md")),
        total_pages=total,
        processed_pages=processed,
        failed_pages=failed or [],
        error=error,
    )


class TestConvertCommand:
    def test_help(self, runner):
        result = runner.invoke(main, ["convert", "--help"])
        assert result.exit_code == 0
        assert "Convert PDF" in result.output

    def test_backend_unavailable_exits_1(self, runner, tmp_path):
        (tmp_path / "in").mkdir()
        out = tmp_path / "out"

        with patch("pdf2md.cli.get_backend") as mock_get:
            mock_backend = MagicMock()
            mock_backend.is_available.return_value = False
            mock_get.return_value = mock_backend

            result = runner.invoke(main, [
                "convert", str(tmp_path / "in"), str(out),
                "--backend", "easyocr"
            ])

        assert result.exit_code == 1
        assert "not installed" in result.output.lower() or "not ready" in result.output.lower() or "easyocr" in result.output.lower()

    def test_no_pdfs_found_exits_0(self, runner, tmp_path):
        in_dir = tmp_path / "in"
        in_dir.mkdir()
        out_dir = tmp_path / "out"

        with patch("pdf2md.cli.get_backend") as mock_get:
            mock_backend = MagicMock()
            mock_backend.is_available.return_value = True
            mock_get.return_value = mock_backend

            result = runner.invoke(main, [
                "convert", str(in_dir), str(out_dir), "--backend", "easyocr"
            ])

        assert result.exit_code == 0

    def test_successful_conversion_exits_0(self, runner, tmp_path):
        in_dir = tmp_path / "in"
        in_dir.mkdir()
        pdf = in_dir / "sample.pdf"
        pdf.write_bytes(b"%PDF-1.4")  # fake pdf

        out_dir = tmp_path / "out"

        with patch("pdf2md.cli.get_backend") as mock_get, \
             patch("pdf2md.cli.PDFProcessor") as mock_proc_cls:

            mock_backend = MagicMock()
            mock_backend.is_available.return_value = True
            mock_get.return_value = mock_backend

            mock_proc = MagicMock()
            mock_proc.process.return_value = PDFResult(
                pdf_path=pdf,
                output_path=out_dir / "sample.md",
                total_pages=5,
                processed_pages=5,
            )
            mock_proc_cls.return_value = mock_proc

            result = runner.invoke(main, [
                "convert", str(in_dir), str(out_dir), "--backend", "easyocr"
            ])

        assert result.exit_code == 0, result.output

    def test_failed_conversion_exits_1(self, runner, tmp_path):
        in_dir = tmp_path / "in"
        in_dir.mkdir()
        (in_dir / "bad.pdf").write_bytes(b"%PDF-1.4")
        out_dir = tmp_path / "out"

        with patch("pdf2md.cli.get_backend") as mock_get, \
             patch("pdf2md.cli.PDFProcessor") as mock_proc_cls:

            mock_backend = MagicMock()
            mock_backend.is_available.return_value = True
            mock_get.return_value = mock_backend

            mock_proc = MagicMock()
            mock_proc.process.return_value = make_pdf_result(error="render failed")
            mock_proc_cls.return_value = mock_proc

            result = runner.invoke(main, [
                "convert", str(in_dir), str(out_dir), "--backend", "easyocr"
            ])

        assert result.exit_code == 1


class TestBackendsCommand:
    def test_backends_lists_easyocr_and_claude(self, runner):
        result = runner.invoke(main, ["backends"])
        assert result.exit_code == 0
        assert "easyocr" in result.output.lower()
        assert "claude" in result.output.lower()


class TestTestPageCommand:
    def test_help(self, runner):
        result = runner.invoke(main, ["test-page", "--help"])
        assert result.exit_code == 0
        assert "page" in result.output.lower()
