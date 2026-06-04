"""OCR backends for Hindi text extraction."""
from .base import OCRBackend, OCRResult
from .easyocr_backend import EasyOCRBackend
from .claude_backend import ClaudeVisionBackend

try:
    from .tesseract_backend import TesseractBackend
    _TESSERACT_AVAILABLE = True
except ImportError:
    _TESSERACT_AVAILABLE = False


def get_backend(name: str, **kwargs) -> OCRBackend:
    """Get OCR backend by name. Options: 'easyocr', 'claude', 'tesseract'."""
    backends = {
        "easyocr": EasyOCRBackend,
        "claude": ClaudeVisionBackend,
    }
    if _TESSERACT_AVAILABLE:
        backends["tesseract"] = TesseractBackend

    if name not in backends:
        available = list(backends.keys())
        raise ValueError(f"Unknown backend '{name}'. Available: {available}")

    return backends[name](**kwargs)


__all__ = ["OCRBackend", "OCRResult", "EasyOCRBackend", "ClaudeVisionBackend", "get_backend"]
