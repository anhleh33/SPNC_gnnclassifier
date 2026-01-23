from pathlib import Path

from backend.settings import ARTIFACTS_DIR, ARTIFACTS_VERSION

from backend.application.services.health_service import HealthService
from backend.infrastructure.repositories.postgres_health_repository import PostgresHealthRepository

from backend.application.services.user_service import UserService
from backend.infrastructure.repositories.postgres_user_repository import PostgresUserRepository

from backend.application.services.classification_history_service import ClassificationHistoryService
from backend.infrastructure.repositories.classification_analysis_repository import PostgresClassificationAnalysisRepository 

from backend.application.services.image_storage_service import SupabaseImageStorageService
from backend.infrastructure.database.supabase import create_supabase_client

from backend.infrastructure.ml.ocr.ocr_engine import OCRReader
from backend.infrastructure.ml.encoders.image_encoder import CLIPImageEncoder
from backend.infrastructure.ml.encoders.text_encoder import MiniLML6TextEncoder
from backend.infrastructure.ml.features.clip_image_feature import CLIPImageFeatureBuilder
from backend.infrastructure.ml.features.node_feature_builder import NodeFeatureBuilder
from backend.infrastructure.ml.features.text_feature_builder import TextFeatureBuilder
from backend.infrastructure.ml.classifiers.graphsage_classifier import GraphSAGEClassifier
from backend.infrastructure.ml.similarity.neighbor_search import NeighborSearcher
from backend.infrastructure.ml.image_classifier import VotingImageClassifier, GraphSAGEImageClassifier
from backend.infrastructure.repositories.classifier_model_repository import FileSystemClassifierModelRepository
from backend.application.services.image_classifier_service import ImageClassificationService
from backend.settings import ARTIFACTS_DIR, ARTIFACTS_VERSION

from backend.infrastructure.repositories.voting_model_repository import FileSystemVotingModelRepository
from backend.infrastructure.ml.classifiers.voting_classifier import VotingClassifier
from backend.infrastructure.ml.encoders.image_encoder import ResNetImageEncoder
from backend.infrastructure.ml.encoders.text_encoder import MiniLML12TextEncoder

health_service = HealthService(PostgresHealthRepository())
user_service = UserService(PostgresUserRepository())
classification_history_service = ClassificationHistoryService(PostgresClassificationAnalysisRepository())
image_storage_service = SupabaseImageStorageService(create_supabase_client(), "GNN Classifier Image Storage")

# Load assets
# artifact_dir = ARTIFACTS_DIR / ARTIFACTS_VERSION
artifact_dir = ARTIFACTS_DIR / "GNN_single_v1"

repo = FileSystemVotingModelRepository(artifact_dir)
assets = repo.load_assets()

print("Voting feature DB shape:", assets.features.shape)
print("Metadata rows:", len(assets.metadata))

ocr = OCRReader()

# GNN_SINGLE_V1
image_encoder = ResNetImageEncoder(device="cpu")   # (1, 2048)
text_encoder = MiniLML12TextEncoder()              # (1, 384)

image_feature_builder = CLIPImageFeatureBuilder(image_encoder)
text_feature_builder = TextFeatureBuilder(ocr, text_encoder)

node_feature_builder = NodeFeatureBuilder(
    image_feature_builder,
    text_feature_builder
)

voting_classifier = VotingClassifier(
    features_db=assets.features,
    metadata_df=assets.metadata
)

image_classifier = VotingImageClassifier(
    node_feature_builder=node_feature_builder,
    voting_classifier=voting_classifier
)

image_encoder = ResNetImageEncoder(device="cpu")   # (1, 2048)
text_encoder = MiniLML12TextEncoder()              # (1, 384)

image_feature_builder = CLIPImageFeatureBuilder(image_encoder)
text_feature_builder = TextFeatureBuilder(ocr, text_encoder)

node_feature_builder = NodeFeatureBuilder(
    image_feature_builder,
    text_feature_builder
)

image_classifier = VotingImageClassifier(
    node_feature_builder=node_feature_builder,
    voting_classifier=voting_classifier
)

voting_classifier = VotingClassifier(
    features_db=assets.features,
    metadata_df=assets.metadata,
    top_k=10,
)

# GNN_DUAL_V2
artifact_dir_2 = ARTIFACTS_DIR / "GNN_dual_v2"
repo_2 = FileSystemClassifierModelRepository(artifact_dir_2)
assets_2 = repo_2.load_assets()
print("Graph x shape:", assets_2.x.shape)

neighbor_searcher = NeighborSearcher(assets_2.x.numpy())
graphsage_classifier = GraphSAGEClassifier(assets_2, neighbor_searcher)

clip_encoder = CLIPImageEncoder(device="cpu")
text_dual_encoder = MiniLML6TextEncoder()

image_feature_dual_builder = CLIPImageFeatureBuilder(clip_encoder)
text_feature_dual_builder = TextFeatureBuilder(ocr, text_dual_encoder)

node_dual_feature_builder = NodeFeatureBuilder(
    image_feature_dual_builder,
    text_feature_dual_builder
)
# Infra orchestrator
image_dual_classifier = GraphSAGEImageClassifier(
    node_feature_builder=node_dual_feature_builder,
    graphsage_classifier=graphsage_classifier
)

image_classifier_service = ImageClassificationService(
    single_classifier=image_classifier,
    dual_classifier=image_dual_classifier
)