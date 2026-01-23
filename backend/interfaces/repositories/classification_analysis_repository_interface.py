# backend/interfaces/repositories/classification_analysis_repository_interface.py

from typing import List
from backend.domain.entities.classification_analysis import ClassificationAnalysis


class IClassificationAnalysisRepository:
    def create(self, analysis: ClassificationAnalysis) -> ClassificationAnalysis:
        raise NotImplementedError

    def list_by_user(self, user_id: int) -> List[ClassificationAnalysis]:
        raise NotImplementedError
