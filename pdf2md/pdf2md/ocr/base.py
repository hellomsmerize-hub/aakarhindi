"""Base OCR interface."""
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from pathlib import Path
from PIL import Image


@dataclass
class OCRResult:
    text: str
    confidence: float = 1.0
    page_num: int = 0
    warnings: list[str] = field(default_factory=list)

    @property
    def is_empty(self) -> bool:
        return not self.text.strip()


class OCRBackend(ABC):
    """Base class for all OCR backends."""

    @abstractmethod
    def extract_text(self, image: Image.Image, page_num: int = 0) -> OCRResult:
        """Extract text from a PIL Image."""
        ...

    @abstractmethod
    def is_available(self) -> bool:
        """Check if this backend's dependencies are met."""
        ...

    def extract_text_from_file(self, path: Path, page_num: int = 0) -> OCRResult:
        """Convenience: load image file and extract text."""
        img = Image.open(path)
        return self.extract_text(img, page_num)
