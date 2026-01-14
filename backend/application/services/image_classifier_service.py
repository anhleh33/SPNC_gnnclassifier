# backend/application/services/image_classifier_service.py
import time

from backend.application.exception import MLServiceUnavailable
from backend.interfaces.services.image_classifier_service_interface import IImageClassifierInterface
from backend.domain.value_objects.subject import SubjectCode, SUBJECT_VI_TO_CODE
from backend.infrastructure.ml.postprocess.subject_grade_combiner import combine_subject_grade

class ImageClassificationService:
    def __init__(self, classifier: IImageClassifierInterface):
        self.classifier = classifier

    @staticmethod
    def _split_subject_grade(label: str) -> tuple[str, int]:
        subject, grade = label.rsplit(" - ", 1)
        return subject, int(grade)
    
    @staticmethod
    def _subject_code(subject: str) -> SubjectCode:
        return SUBJECT_VI_TO_CODE.get(subject, SubjectCode.UNKNOWN)

    def classify_image(self, image_bytes: bytes) -> dict:
        start_time = time.perf_counter()
        
        try:
            raw = self.classifier.classify(image_bytes)
        except Exception as e:
            raise MLServiceUnavailable("ML inference failed") from e

        raw = self.classifier.classify(image_bytes)

        subjects = raw["subjects"]
        grades = raw["grades"]

        # 1. Combine
        pairs = combine_subject_grade(
            subjects,
            grades,
            method="weighted"
        )

        # 2. Sort
        pairs = sorted(pairs, key=lambda x: x[1], reverse=True)

        # 3. Extract primary
        primary_label, primary_conf = pairs[0]

        subject, grade = self._split_subject_grade(primary_label)

        processing_time_ms = (time.perf_counter() - start_time) * 1000

        # 4. Shape payload
        return {
            "label": primary_label,
            "confidence": primary_conf,
            "subject": subject,
            "subject_code": self._subject_code(subject),
            "grade": grade,
            "processing_time_ms": round(processing_time_ms, 2),
            "top_predictions": [
                {
                    "label": label,
                    "confidence": score,
                    "subject": self._split_subject_grade(label)[0],
                    "subject_code": self._subject_code(self._split_subject_grade(label)[0]),
                    "grade": self._split_subject_grade(label)[1],
                }
                for label, score in pairs
            ],
        }
