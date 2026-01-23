# backend/infrastructure/repositories/classification_analysis_repository.py

from typing import List

from backend.domain.entities.classification_analysis import ClassificationAnalysis
from backend.interfaces.repositories.classification_analysis_repository_interface import (
    IClassificationAnalysisRepository,
)

from backend.infrastructure.database.postgres import SessionLocal
from backend.infrastructure.database.models.classification_analysis_model import (
    ClassificationAnalysisModel,
)


class PostgresClassificationAnalysisRepository(
    IClassificationAnalysisRepository
):

    def _to_entity(
        self,
        model: ClassificationAnalysisModel,
    ) -> ClassificationAnalysis:
        return ClassificationAnalysis(
            id=model.id,
            user_id=model.user_id,
            image_path=model.image_path,
            label=model.label,
            confidence=model.confidence,
            subject=model.subject,
            subject_code=model.subject_code,
            grade=model.grade,
            model_variant=model.model_variant,
            created_at=model.created_at,
        )

    def _to_model(
        self,
        analysis: ClassificationAnalysis,
    ) -> ClassificationAnalysisModel:
        return ClassificationAnalysisModel(
            user_id=analysis.user_id,
            image_path=analysis.image_path,
            label=analysis.label,
            confidence=analysis.confidence,
            subject=analysis.subject,
            subject_code=analysis.subject_code,
            grade=analysis.grade,
            model_variant=analysis.model_variant,
        )

    def create(
        self,
        analysis: ClassificationAnalysis,
    ) -> ClassificationAnalysis:
        db = SessionLocal()
        try:
            model = self._to_model(analysis)
            db.add(model)
            db.commit()
            db.refresh(model)
            return self._to_entity(model)
        finally:
            db.close()

    def list_by_user(
        self,
        user_id: int,
    ) -> List[ClassificationAnalysis]:
        db = SessionLocal()
        try:
            models = (
                db.query(ClassificationAnalysisModel)
                .filter_by(user_id=user_id)
                .order_by(ClassificationAnalysisModel.created_at.desc())
                .all()
            )
            return [self._to_entity(m) for m in models]
        finally:
            db.close()
