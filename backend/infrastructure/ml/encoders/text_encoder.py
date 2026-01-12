import torch
from sentence_transformers import SentenceTransformer


class TextEncoder:
    def __init__(
        self,
        model_name="all-MiniLM-L6-v2",
        device=None
    ):
        self.device = device or (
            "cuda" if torch.cuda.is_available() else "cpu"
        )
        self.model = SentenceTransformer(
            model_name,
            device=self.device
        )

    def encode(self, text: str) -> torch.Tensor:
        if not text.strip():
            return torch.zeros(1, 384)

        emb = self.model.encode(
            text,
            convert_to_tensor=True,
            normalize_embeddings=True
        )

        return emb.unsqueeze(0) if emb.dim() == 1 else emb