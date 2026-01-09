import torch
from pathlib import Path

from ml_kernel.features.clip_feature import CLIPImageFeatureBuilder
from ml_kernel.features.text_feature import TextFeatureBuilder


class NodeFeatureBuilder:
    def __init__(self, device="cpu"):
        self.image_builder = CLIPImageFeatureBuilder(device=device)
        self.text_builder = TextFeatureBuilder()

    def build(self, image_path):
        image_path = Path(image_path)

        img_feat = self.image_builder.build(image_path)
        text_feat = self.text_builder.build(image_path)

        print("Image feat shape:", img_feat.shape)
        print("Text feat shape:", text_feat.shape)

        node_feat = torch.cat([text_feat, img_feat], dim=1)
        print("Node feat shape:", node_feat.shape)

        return node_feat