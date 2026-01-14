from sentence_transformers import SentenceTransformer, models
import torch

from backend.settings import TEXT_ENCODER_MODEL_DIR


class TextEncoder:
    def __init__(self, device=None):
        self.device = device or (
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        transformer = models.Transformer(
            str(TEXT_ENCODER_MODEL_DIR),
            max_seq_length=256
        )

        pooling = models.Pooling(
            word_embedding_dimension=transformer.get_word_embedding_dimension(),
            pooling_mode_mean_tokens=True
        )

        self.model = SentenceTransformer(
            modules=[transformer, pooling],
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
