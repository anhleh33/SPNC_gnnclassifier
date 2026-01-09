from backend.interfaces.services.image_classifier_service_interface import ImageClassifierInterface

class ImageClassifier(ImageClassifierInterface):
    def classify(self, image_bytes: bytes) -> dict:
        return {
            "label": "unknown",
            "confidence": 0.0,
            "status": "model_not_implemented"
        }
