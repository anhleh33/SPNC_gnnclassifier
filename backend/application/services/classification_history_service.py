# backend/application/services/classification_history_service.py

from typing import List

from backend.domain.entities.classification_analysis import ClassificationAnalysis
from backend.interfaces.repositories.classification_analysis_repository_interface import IClassificationAnalysisRepository
from backend.interfaces.services.classification_history_service_interface import IClassificationHistoryService



class ClassificationHistoryService(IClassificationHistoryService):

    def __init__(self, repository: IClassificationAnalysisRepository):
        self.repository = repository

    def save(self, *, user_id: int, image_path: str, result: dict, model_variant: str) -> ClassificationAnalysis:
        """
        Persist only the PRIMARY prediction from model output.
        """

        analysis = ClassificationAnalysis(
            id=None,
            user_id=user_id,
            image_path=image_path,
            label=result["label"],
            confidence=float(result["confidence"]),
            subject=result["subject"],
            subject_code=result["subject_code"],
            grade=int(result["grade"]),
            model_variant=model_variant,
        )

        return self.repository.create(analysis)

    def list_by_user(
        self,
        user_id: int,
    ) -> List[ClassificationAnalysis]:
        return self.repository.list_by_user(user_id)
