from pathlib import Path
from ml_kernel.encoders.ocr import OCRReader
from ml_kernel.encoders.text import TextEncoder


class TextFeatureBuilder:
    def __init__(self):
        self.ocr = OCRReader()
        self.encoder = TextEncoder()

    def build(self, image_path):
        image_path = Path(image_path)
        text = self.ocr.extract(image_path)
        return self.encoder.encode(text)
