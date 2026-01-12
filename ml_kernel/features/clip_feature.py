import torch
from pathlib import Path

from backend.infrastructure.ml.features.clip_image_feature import CLIPImageFeatureBuilder
from backend.infrastructure.ml.features.text_feature import TextFeatureBuilder


class NodeFeatureBuilder:
    def __init__(self, device="cpu"):
        self.image_builder = CLIPImageFeatureBuilder(device=device)
        self.text_builder = TextFeatureBuilder()

    def build(self, image_path: Path) -> torch.Tensor:
        img_feat = self.image_builder.build(image_path)   # (1, 512)
        text_feat = self.text_builder.build(image_path)   # (1, 384)

        node_feat = torch.cat([text_feat, img_feat], dim=1)  # (1, 896)

        return node_feat
