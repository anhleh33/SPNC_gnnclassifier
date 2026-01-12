# backend/infrastructure/ml/image_classifier.py

import tempfile
from pathlib import Path
from backend.infrastructure.ml.postprocess.subject_grade_combiner import combine_subject_grade

class ImageClassifier:
    def __init__(
        self,
        node_feature_builder,
        graphsage_classifier,
    ):
        self.node_feature_builder = node_feature_builder
        self.classifier = graphsage_classifier

    def classify(self, image_bytes: bytes) -> dict:
        image_path = self._save_temp_image(image_bytes)

        node_feat = self.node_feature_builder.build(image_path)

        subjects, grades = self.classifier.classify(node_feat)
        pairs = combine_subject_grade(subjects, grades)

        return {
            "subjects": subjects,
            "grades": grades,
            "pairs": pairs
        }

    def _save_temp_image(self, image_bytes: bytes) -> Path:
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
        tmp.write(image_bytes)
        tmp.close()
        return Path(tmp.name)
