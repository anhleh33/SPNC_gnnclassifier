import torch
from PIL import Image
import open_clip
from pathlib import Path

from backend.settings import OPEN_CLIP_MODEL_DIR


class CLIPImageEncoder:
    def __init__(self, device="cpu"):
        self.device = device

        self.model, _, self.preprocess = open_clip.create_model_and_transforms(
            'ViT-B-32',
            # pretrained='openai'
            pretrained=str(OPEN_CLIP_MODEL_DIR / "open_clip_model.safetensors")
        )
        self.model.to(self.device)
        self.model.eval()

    @torch.no_grad()
    def encode(self, image_path: str) -> torch.Tensor:
        image = Image.open(image_path).convert("RGB")
        image = self.preprocess(image).unsqueeze(0).to(self.device)

        feat = self.model.encode_image(image)
        feat = feat / feat.norm(dim=-1, keepdim=True)

        return feat.cpu()  # (1, 512)
