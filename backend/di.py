from pathlib import Path

from backend.settings import ARTIFACTS_DIR, ARTIFACTS_VERSION

from backend.application.services.health_service import HealthService
from backend.infrastructure.repositories.postgres_health_repository import PostgresHealthRepository

from backend.application.services.user_service import UserService
from backend.infrastructure.repositories.postgres_user_repository import PostgresUserRepository

from backend.infrastructure.ml.ocr.ocr_engine import OCRReader
from backend.infrastructure.ml.encoders.image_encoder import CLIPImageEncoder
from backend.infrastructure.ml.encoders.text_encoder import MiniLML6TextEncoder
from backend.infrastructure.ml.features.clip_image_feature import CLIPImageFeatureBuilder
from backend.infrastructure.ml.features.node_feature_builder import NodeFeatureBuilder
from backend.infrastructure.ml.features.text_feature_builder import TextFeatureBuilder
from backend.infrastructure.ml.classifiers.graphsage_classifier import GraphSAGEClassifier
from backend.infrastructure.ml.similarity.neighbor_search import NeighborSearcher
from backend.infrastructure.ml.image_classifier import VotingImageClassifier
from backend.infrastructure.repositories.classifier_model_repository import FileSystemClassifierModelRepository
from backend.application.services.image_classifier_service import ImageClassificationService
from backend.settings import ARTIFACTS_DIR, ARTIFACTS_VERSION

from backend.infrastructure.repositories.voting_model_repository import FileSystemVotingModelRepository
from backend.infrastructure.ml.classifiers.voting_classifier import VotingClassifier
from backend.infrastructure.ml.encoders.image_encoder import ResNetImageEncoder
from backend.infrastructure.ml.encoders.text_encoder import MiniLML12TextEncoder

health_service = HealthService(PostgresHealthRepository())
user_service = UserService(PostgresUserRepository())

# Load assets
artifact_dir = ARTIFACTS_DIR / ARTIFACTS_VERSION
# repo = FileSystemClassifierModelRepository(artifact_dir)
# assets = repo.load_assets()
# print("Graph x shape:", assets.x.shape)

# neighbor_searcher = NeighborSearcher(assets.x.numpy())
# graphsage_classifier = GraphSAGEClassifier(assets, neighbor_searcher)

artifact_dir = ARTIFACTS_DIR / "GNN_single_v1"

repo = FileSystemVotingModelRepository(artifact_dir)
assets = repo.load_assets()

print("Voting feature DB shape:", assets.features.shape)
print("Metadata rows:", len(assets.metadata))

ocr = OCRReader()

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

image_classifier_service = ImageClassificationService(image_classifier)

ocr = OCRReader()

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


image_classifier_service = ImageClassificationService(image_classifier)

# ocr = OCRReader()

# clip_encoder = CLIPImageEncoder(device="cpu")
# text_encoder = MiniLML6TextEncoder()

# image_feature_builder = CLIPImageFeatureBuilder(clip_encoder)
# text_feature_builder = TextFeatureBuilder(ocr, text_encoder)

# node_feature_builder = NodeFeatureBuilder(
#     image_feature_builder,
#     text_feature_builder
# )

# # Infra orchestrator
# image_classifier = ImageClassifier(
#     node_feature_builder=node_feature_builder,
#     graphsage_classifier=graphsage_classifier
# )

# # Application service
# image_classifier_service = ImageClassificationService(image_classifier)