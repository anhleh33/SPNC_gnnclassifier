from sentence_transformers import SentenceTransformer, models
import torch

from backend.settings import TEXT_ENCODER_MODEL_DIR

class MiniLML6TextEncoder:
    """
    Text encoder using all-MiniLM-L6-v2 (384-dim).

    Legacy encoder used in:
        - GNN_dual_v1
        - GNN_dual_v2
    """

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
        if not text or not text.strip():
            return torch.zeros(1, 384)

        emb = self.model.encode(
            text,
            convert_to_tensor=True,
            normalize_embeddings=True
        )

        return emb.unsqueeze(0) if emb.dim() == 1 else emb
    
class MiniLML12TextEncoder:
    """
    Text encoder using paraphrase-multilingual-MiniLM-L12-v2 (384-dim).

    Used in:
        - GNN_single_v1
        - Voting-based similarity pipelines
    """

    def __init__(self, device=None):
        self.device = device or (
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        self.model = SentenceTransformer(
            "paraphrase-multilingual-MiniLM-L12-v2",
            device=self.device
        )

    def encode(self, text: str) -> torch.Tensor:
        if not text or not text.strip():
            return torch.zeros(1, 384)

        emb = self.model.encode(
            text,
            convert_to_tensor=True,
            normalize_embeddings=True
        )

        return emb.unsqueeze(0) if emb.dim() == 1 else emb