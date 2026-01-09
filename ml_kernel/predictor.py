# predictor.py
import json
import torch
import torch.nn.functional as F
import numpy as np

from torch_geometric.nn import SAGEConv
from sklearn.metrics.pairwise import cosine_similarity
from pathlib import Path

from ml_kernel.features.clip_feature import CLIPImageFeatureBuilder
from ml_kernel.features.text_feature import TextFeatureBuilder
from ml_kernel.features.node_feature import NodeFeatureBuilder
from ml_kernel.postprocess import combine_subject_grade


BASE = Path(__file__).parent
ART = BASE / "artifacts"

# ---------- Model definition ----------
class GraphSAGE(torch.nn.Module):
    def __init__(self, in_channels, hidden_channels, out_channels):
        super().__init__()
        self.conv1 = SAGEConv(in_channels, hidden_channels)
        self.conv2 = SAGEConv(hidden_channels, out_channels)

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index)
        x = F.relu(x)
        x = self.conv2(x, edge_index)
        return x


# ---------- Load static data ----------
graph = torch.load(ART / "graph_data.pt", map_location="cpu")
x = graph["x"]
edge_index = graph["edge_index"]

with open(ART / "subject_labels.json", encoding="utf-8") as f:
    SUBJECT_LABELS = json.load(f)

with open(ART / "grade_labels.json", encoding="utf-8") as f:
    GRADE_LABELS = json.load(f)
    
X = x.numpy()

# ---------- Load models ----------
def load_model(path, out_dim):
    model = GraphSAGE(896, 256, out_dim)
    model.load_state_dict(torch.load(path, map_location="cpu"))
    model.eval()
    return model

model_subject = load_model(
    ART / "graphsage_subject.pt",
    len(SUBJECT_LABELS)
)

model_grade = load_model(
    ART / "graphsage_grade.pt",
    len(GRADE_LABELS)
)


# ---------- Core inference ----------
def find_neighbors(new_feat, k=10):
    sims = cosine_similarity(new_feat, X)[0]
    return sims.argsort()[-k:]


def predict_topk(
    node_feat: torch.Tensor,
    model,
    labels,
    k_neighbors=10,
    topk=3
):
    neighbors = find_neighbors(node_feat.numpy(), k_neighbors)

    new_node_id = x.size(0)
    x_all = torch.cat([x, node_feat], dim=0)

    edges = []
    for n in neighbors:
        edges += [[n, new_node_id], [new_node_id, n]]

    edge_index_new = torch.cat(
        [edge_index, torch.tensor(edges).t().long()],
        dim=1
    )

    with torch.no_grad():
        logits = model(x_all, edge_index_new)[new_node_id]
        probs = F.softmax(logits, dim=0)

    top_probs, top_ids = torch.topk(probs, topk)
    return [
        (labels[str(i.item())], float(p))
        for p, i in zip(top_probs, top_ids)
    ]

nfb = NodeFeatureBuilder(device="cpu")
node_feat = nfb.build("D:/SPNC_gnnclassifier/ml_kernel/IMAGE.png")

subjects = predict_topk(
    node_feat,
    model_subject,
    SUBJECT_LABELS
)

grades = predict_topk(
    node_feat,
    model_grade,
    GRADE_LABELS
)

print(subjects)
print(grades)
print("Node feature shape:", node_feat.shape)

pairs = combine_subject_grade(
    subjects,
    grades,
    topk=5
)

for label, prob in pairs:
    print(f"{label}: {prob:.4f}")