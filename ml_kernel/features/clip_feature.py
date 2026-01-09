import torch
from ml_kernel.encoders.clip_image import CLIPImageEncoder


class CLIPImageFeatureBuilder:
    def __init__(self, device="cpu"):
        self.image_encoder = CLIPImageEncoder(device=device)

    def build(self, image_path: str) -> torch.Tensor:
        img_feat = self.image_encoder.encode(image_path)  # (1, 512)

        return img_feat
