"""Tesseract backend — free, offline, requires tesseract + hin lang pack."""
from __future__ import annotations
import logging
from PIL import Image

from .base import OCRBackend, OCRResult

logger = logging.getLogger(__name__)


class TesseractBackend(OCRBackend):
    """
    Tesseract OCR with Hindi language support.
    Install: brew install tesseract tesseract-lang
    Accuracy: decent for printed Hindi, poor for handwriting.
    """

    def __init__(self, lang: str = "hin+eng", config: str = "--psm 3"):
        self._lang = lang
        self._config = config

    def is_available(self) -> bool:
        try:
            import pytesseract
            pytesseract.get_tesseract_version()
            return True
        except Exception:
            return False

    def extract_text(self, image: Image.Image, page_num: int = 0) -> OCRResult:
        import pytesseract
        data = pytesseract.image_to_data(
            image,
            lang=self._lang,
            config=self._config,
            output_type=pytesseract.Output.DICT,
        )

        words = []
        confidences = []
        prev_block = -1
        prev_par = -1

        for i, word in enumerate(data["text"]):
            conf = int(data["conf"][i])
            if conf < 0 or not word.strip():
                continue
            block = data["block_num"][i]
            par = data["par_num"][i]
            if (block, par) != (prev_block, prev_par) and words:
                words.append("\n")
            words.append(word)
            confidences.append(conf / 100.0)
            prev_block, prev_par = block, par

        text = " ".join(words).replace(" \n ", "\n").strip()
        avg_conf = float(sum(confidences) / len(confidences)) if confidences else 0.0
        return OCRResult(text=text, confidence=avg_conf, page_num=page_num)
