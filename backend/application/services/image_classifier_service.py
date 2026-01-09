from backend.interfaces.services.image_classifier_service_interface import ImageClassifierInterface


class ImageClassificationService:
    def __init__(self, classifier: ImageClassifierInterface):
        self.classifier = classifier

    def classify_image(self, image_bytes: bytes) -> dict:
        return self.classifier.classify(image_bytes)
