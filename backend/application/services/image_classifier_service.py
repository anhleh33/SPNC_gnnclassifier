# backend/application/services/image_classifier_service.py
from backend.interfaces.services.image_classifier_service_interface import IImageClassifierInterface

class ImageClassificationService:
    def __init__(self, classifier: IImageClassifierInterface):
        self.classifier = classifier

    def classify_image(self, image_bytes: bytes) -> dict:
        return self.classifier.classify(image_bytes)
