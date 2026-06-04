"""Shared test fixtures."""
import io
from pathlib import Path

import pytest
from PIL import Image, ImageDraw, ImageFont


FIXTURES_DIR = Path(__file__).parent / "fixtures"


def make_hindi_test_image(text: str = "नमस्ते", size=(800, 600)) -> Image.Image:
    """Create a simple white test image with text."""
    img = Image.new("RGB", size, color="white")
    draw = ImageDraw.Draw(img)
    # Draw text in black — font may not render Hindi but good enough for mock tests
    draw.text((50, 50), text, fill="black")
    return img


@pytest.fixture
def hindi_image():
    return make_hindi_test_image("नमस्ते दुनिया\nHello World")


@pytest.fixture
def blank_image():
    return Image.new("RGB", (800, 600), color="white")


@pytest.fixture
def sample_pdf_path():
    """Path to a test PDF in fixtures dir."""
    return FIXTURES_DIR / "sample.pdf"


@pytest.fixture
def tmp_output_dir(tmp_path):
    out = tmp_path / "output"
    out.mkdir()
    return out
