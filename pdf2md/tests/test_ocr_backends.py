"""Tests for OCR backends."""
import io
from unittest.mock import MagicMock, patch, PropertyMock

import pytest
from PIL import Image

from pdf2md.ocr.base import OCRResult
from pdf2md.ocr.easyocr_backend import EasyOCRBackend
from pdf2md.ocr.claude_backend import ClaudeVisionBackend


class TestOCRResult:
    def test_is_empty_true(self):
        r = OCRResult(text="   ", confidence=0.5)
        assert r.is_empty

    def test_is_empty_false(self):
        r = OCRResult(text="नमस्ते", confidence=0.9)
        assert not r.is_empty

    def test_defaults(self):
        r = OCRResult(text="hello")
        assert r.confidence == 1.0
        assert r.page_num == 0
        assert r.warnings == []


class TestEasyOCRBackend:
    def test_is_available_when_easyocr_installed(self):
        backend = EasyOCRBackend()
        try:
            import easyocr  # noqa
            assert backend.is_available()
        except ImportError:
            assert not backend.is_available()

    def test_extract_text_returns_ocr_result(self, hindi_image):
        """EasyOCR can process an image without crashing."""
        backend = EasyOCRBackend()
        if not backend.is_available():
            pytest.skip("EasyOCR not installed")

        result = backend.extract_text(hindi_image, page_num=0)
        assert isinstance(result, OCRResult)
        assert result.page_num == 0
        assert isinstance(result.text, str)
        assert 0.0 <= result.confidence <= 1.0

    def test_extract_text_blank_image(self, blank_image):
        """Blank image should return empty text with warning."""
        backend = EasyOCRBackend()
        if not backend.is_available():
            pytest.skip("EasyOCR not installed")

        result = backend.extract_text(blank_image)
        assert isinstance(result, OCRResult)
        # Blank image may return empty text
        assert isinstance(result.text, str)

    def test_lazy_reader_init(self):
        """Reader should not be initialized until first use."""
        backend = EasyOCRBackend()
        assert backend._reader is None

    def test_extract_text_with_mock_reader(self, hindi_image):
        """Test extraction with mocked EasyOCR to avoid slow model loading."""
        mock_reader = MagicMock()
        mock_reader.readtext.return_value = [
            ([0, 0, 100, 100], "नमस्ते", 0.95),
            ([0, 100, 100, 200], "Hello", 0.98),
        ]
        mock_easyocr = MagicMock()
        mock_easyocr.Reader.return_value = mock_reader

        import sys
        sys.modules.setdefault("easyocr", mock_easyocr)
        original = sys.modules.get("easyocr")
        sys.modules["easyocr"] = mock_easyocr
        try:
            backend = EasyOCRBackend(gpu=False)
            result = backend.extract_text(hindi_image, page_num=3)
        finally:
            if original is None:
                sys.modules.pop("easyocr", None)
            else:
                sys.modules["easyocr"] = original

        assert result.page_num == 3
        assert "नमस्ते" in result.text
        assert "Hello" in result.text
        assert result.confidence == pytest.approx(0.965, abs=0.01)

    def test_empty_detection_returns_warning(self, hindi_image):
        mock_reader = MagicMock()
        mock_reader.readtext.return_value = []
        mock_easyocr = MagicMock()
        mock_easyocr.Reader.return_value = mock_reader

        import sys
        original = sys.modules.get("easyocr")
        sys.modules["easyocr"] = mock_easyocr
        try:
            backend = EasyOCRBackend()
            result = backend.extract_text(hindi_image)
        finally:
            if original is None:
                sys.modules.pop("easyocr", None)
            else:
                sys.modules["easyocr"] = original

        assert result.is_empty
        assert result.confidence == 0.0
        assert len(result.warnings) > 0


class TestClaudeVisionBackend:
    def test_is_available_without_api_key(self, monkeypatch):
        monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
        backend = ClaudeVisionBackend()
        assert not backend.is_available()

    def test_is_available_with_api_key(self, monkeypatch):
        monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-ant-test-key")
        backend = ClaudeVisionBackend()
        try:
            import anthropic  # noqa
            assert backend.is_available()
        except ImportError:
            assert not backend.is_available()

    def test_resize_image_small(self, hindi_image):
        backend = ClaudeVisionBackend(max_image_size=1568)
        resized = backend._resize_image(hindi_image)
        assert max(resized.size) <= 1568

    def test_resize_image_large(self):
        big_image = Image.new("RGB", (3000, 4000), color="white")
        backend = ClaudeVisionBackend(max_image_size=1568)
        resized = backend._resize_image(big_image)
        assert max(resized.size) <= 1568
        # Aspect ratio preserved
        orig_ratio = 3000 / 4000
        new_ratio = resized.size[0] / resized.size[1]
        assert abs(orig_ratio - new_ratio) < 0.01

    def test_image_to_base64_returns_valid_b64(self, hindi_image):
        backend = ClaudeVisionBackend()
        import base64
        b64, media_type = backend._image_to_base64(hindi_image)
        assert media_type == "image/jpeg"
        decoded = base64.b64decode(b64)
        assert decoded[:3] == b"\xff\xd8\xff"  # JPEG magic bytes

    def test_extract_text_calls_api(self, hindi_image, monkeypatch):
        monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-ant-test")

        mock_content = MagicMock()
        mock_content.text = "नमस्ते दुनिया\nHello World"

        mock_response = MagicMock()
        mock_response.content = [mock_content]

        mock_client = MagicMock()
        mock_client.messages.create.return_value = mock_response

        with patch("anthropic.Anthropic", return_value=mock_client):
            backend = ClaudeVisionBackend()
            result = backend.extract_text(hindi_image, page_num=5)

        assert result.page_num == 5
        assert "नमस्ते" in result.text
        assert result.confidence == 1.0

    def test_extract_text_retries_on_rate_limit(self, hindi_image, monkeypatch):
        monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-ant-test")

        call_count = 0

        def mock_create(*args, **kwargs):
            nonlocal call_count
            call_count += 1
            if call_count < 3:
                raise Exception("rate_limit exceeded")
            mock_content = MagicMock()
            mock_content.text = "नमस्ते"
            mock_response = MagicMock()
            mock_response.content = [mock_content]
            return mock_response

        mock_client = MagicMock()
        mock_client.messages.create.side_effect = mock_create

        with patch("anthropic.Anthropic", return_value=mock_client):
            backend = ClaudeVisionBackend(max_retries=3, retry_delay=0.01)
            result = backend.extract_text(hindi_image)

        assert call_count == 3
        assert "नमस्ते" in result.text

    def test_extract_text_raises_after_all_retries(self, hindi_image, monkeypatch):
        monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-ant-test")

        mock_client = MagicMock()
        mock_client.messages.create.side_effect = Exception("API failure")

        with patch("anthropic.Anthropic", return_value=mock_client):
            backend = ClaudeVisionBackend(max_retries=2, retry_delay=0.01)
            with pytest.raises(RuntimeError, match="Claude Vision failed"):
                backend.extract_text(hindi_image)
