from abc import ABC, abstractmethod


class ImageClassifierInterface(ABC):
    @abstractmethod
    def classify(self, image_bytes: bytes) -> dict:
        pass
