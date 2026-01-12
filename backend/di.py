from pathlib import Path

from backend.settings import ARTIFACTS_DIR, ARTIFACTS_VERSION

from backend.application.services.health_service import HealthService
from backend.infrastructure.repositories.postgres_health_repository import PostgresHealthRepository

from backend.application.services.user_service import UserService
from backend.infrastructure.repositories.postgres_user_repository import PostgresUserRepository

from backend.infrastructure.ml.ocr.ocr_engine import OCRReader
from backend.infrastructure.ml.encoders.image_encoder import CLIPImageEncoder
from backend.infrastructure.ml.encoders.text_encoder import TextEncoder
from backend.infrastructure.ml.features.clip_image_feature import CLIPImageFeatureBuilder
from backend.infrastructure.ml.features.node_feature_builder import NodeFeatureBuilder
from backend.infrastructure.ml.features.text_feature_builder import TextFeatureBuilder
from backend.infrastructure.ml.classifiers.graphsage_classifier import GraphSAGEClassifier
from backend.infrastructure.ml.similarity.neighbor_search import NeighborSearcher
from backend.infrastructure.ml.image_classifier import ImageClassifier
from backend.infrastructure.repositories.classifier_model_repository import FileSystemClassifierModelRepository
from backend.application.services.image_classifier_service import ImageClassificationService
from backend.settings import ARTIFACTS_DIR, ARTIFACTS_VERSION

health_service = HealthService(PostgresHealthRepository())
user_service = UserService(PostgresUserRepository())

# Load assets
artifact_dir = ARTIFACTS_DIR / ARTIFACTS_VERSION
repo = FileSystemClassifierModelRepository(artifact_dir)
assets = repo.load_assets()
print("Graph x shape:", assets.x.shape)

neighbor_searcher = NeighborSearcher(assets.x.numpy())
graphsage_classifier = GraphSAGEClassifier(assets, neighbor_searcher)


ocr = OCRReader()

clip_encoder = CLIPImageEncoder(device="cpu")
text_encoder = TextEncoder()

image_feature_builder = CLIPImageFeatureBuilder(clip_encoder)
text_feature_builder = TextFeatureBuilder(ocr, text_encoder)

node_feature_builder = NodeFeatureBuilder(
    image_feature_builder,
    text_feature_builder
)

# Infra orchestrator
image_classifier = ImageClassifier(
    node_feature_builder=node_feature_builder,
    graphsage_classifier=graphsage_classifier
)

# Application service
image_classifier_service = ImageClassificationService(image_classifier)