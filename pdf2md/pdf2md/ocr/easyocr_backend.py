"""EasyOCR backend — free, offline, good Hindi support."""
from __future__ import annotations
import io
import logging
from typing import Optional
import numpy as np
from PIL import Image

from .base import OCRBackend, OCRResult

logger = logging.getLogger(__name__)


class EasyOCRBackend(OCRBackend):
    """
    Uses EasyOCR with Hindi ('hi') + English ('en') language models.
    Models download automatically on first use (~500MB).
    GPU accelerated if CUDA available, otherwise CPU.
    """

    def __init__(self, gpu: bool = False, languages: Optional[list[str]] = None):
        self._gpu = gpu
        self._languages = languages or ["hi", "en"]
        self._reader = None  # lazy init — model load is slow

    def _get_reader(self):
        if self._reader is None:
            import easyocr
            logger.info("Loading EasyOCR model (first run downloads ~500MB)...")
            self._reader = easyocr.Reader(self._languages, gpu=self._gpu)
            logger.info("EasyOCR model loaded.")
        return self._reader

    def is_available(self) -> bool:
        try:
            import easyocr  # noqa: F401
            return True
        except ImportError:
            return False

    def extract_text(self, image: Image.Image, page_num: int = 0) -> OCRResult:
        reader = self._get_reader()

        # EasyOCR works best with numpy array
        img_array = np.array(image.convert("RGB"))
        results = reader.readtext(img_array, detail=1, paragraph=True)

        if not results:
            return OCRResult(text="", confidence=0.0, page_num=page_num,
                             warnings=["No text detected"])

        # paragraph=True returns (bbox, text, confidence)
        lines = []
        confidences = []
        for item in results:
            if len(item) == 3:
                _, text, conf = item
            else:
                _, text = item[:2]
                conf = 1.0
            lines.append(text.strip())
            confidences.append(conf)

        full_text = "\n".join(l for l in lines if l)
        avg_confidence = float(np.mean(confidences)) if confidences else 0.0

        return OCRResult(text=full_text, confidence=avg_confidence, page_num=page_num)
