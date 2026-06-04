"""Claude Vision backend — highest accuracy, requires API key."""
from __future__ import annotations
import base64
import io
import logging
import os
import time
from PIL import Image

from .base import OCRBackend, OCRResult

logger = logging.getLogger(__name__)

CLAUDE_OCR_PROMPT = """You are an expert OCR engine specializing in Hindi (Devanagari script) and English text.

Extract ALL text from this image exactly as it appears. Rules:
1. Preserve Hindi (Devanagari) characters exactly — do not transliterate
2. Preserve paragraph breaks as blank lines
3. Preserve numbered/bulleted lists with their original markers
4. Preserve headings — mark with # / ## / ### based on visual size/weight
5. If text is handwritten, do your best — mark uncertain words with [?]
6. If a region is illegible, write [ILLEGIBLE]
7. Output ONLY the extracted text, no commentary, no preamble

Extract now:"""


class ClaudeVisionBackend(OCRBackend):
    """
    Uses Claude claude-sonnet-4-6 vision to extract Hindi + English text.
    Most accurate for complex layouts, mixed scripts, handwriting.
    Requires ANTHROPIC_API_KEY environment variable.
    Cost: ~$0.003-0.015 per page depending on image size.
    """

    def __init__(
        self,
        model: str = "claude-sonnet-4-6",
        max_retries: int = 3,
        retry_delay: float = 2.0,
        max_image_size: int = 1568,  # Claude's optimal long-edge
    ):
        self._model = model
        self._max_retries = max_retries
        self._retry_delay = retry_delay
        self._max_image_size = max_image_size
        self._client = None

    def _get_client(self):
        if self._client is None:
            import anthropic
            api_key = os.environ.get("ANTHROPIC_API_KEY")
            if not api_key:
                raise EnvironmentError(
                    "ANTHROPIC_API_KEY not set. Export it or add to .env file."
                )
            self._client = anthropic.Anthropic(api_key=api_key)
        return self._client

    def is_available(self) -> bool:
        try:
            import anthropic  # noqa: F401
            return bool(os.environ.get("ANTHROPIC_API_KEY"))
        except ImportError:
            return False

    def _resize_image(self, image: Image.Image) -> Image.Image:
        """Resize so long edge ≤ max_image_size, preserving aspect ratio."""
        w, h = image.size
        long_edge = max(w, h)
        if long_edge <= self._max_image_size:
            return image
        scale = self._max_image_size / long_edge
        new_w, new_h = int(w * scale), int(h * scale)
        return image.resize((new_w, new_h), Image.LANCZOS)

    def _image_to_base64(self, image: Image.Image) -> tuple[str, str]:
        """Convert PIL image to base64 string. Returns (b64_data, media_type)."""
        image = self._resize_image(image)
        buf = io.BytesIO()
        # JPEG for photos/scans (smaller), PNG for diagrams
        image = image.convert("RGB")
        image.save(buf, format="JPEG", quality=92, optimize=True)
        b64 = base64.standard_b64encode(buf.getvalue()).decode("utf-8")
        return b64, "image/jpeg"

    def extract_text(self, image: Image.Image, page_num: int = 0) -> OCRResult:
        client = self._get_client()
        b64_data, media_type = self._image_to_base64(image)

        for attempt in range(self._max_retries):
            try:
                response = client.messages.create(
                    model=self._model,
                    max_tokens=4096,
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "image",
                                    "source": {
                                        "type": "base64",
                                        "media_type": media_type,
                                        "data": b64_data,
                                    },
                                },
                                {"type": "text", "text": CLAUDE_OCR_PROMPT},
                            ],
                        }
                    ],
                )
                text = response.content[0].text.strip()
                return OCRResult(text=text, confidence=1.0, page_num=page_num)

            except Exception as e:
                err_str = str(e)
                if "rate_limit" in err_str.lower() or "529" in err_str:
                    wait = self._retry_delay * (2 ** attempt)
                    logger.warning(f"Rate limited. Waiting {wait}s before retry {attempt+1}/{self._max_retries}")
                    time.sleep(wait)
                elif attempt < self._max_retries - 1:
                    logger.warning(f"Claude API error (attempt {attempt+1}): {e}")
                    time.sleep(self._retry_delay)
                else:
                    raise RuntimeError(f"Claude Vision failed after {self._max_retries} attempts: {e}") from e

        return OCRResult(text="", confidence=0.0, page_num=page_num,
                         warnings=["All retries exhausted"])
