import csv
from pathlib import Path

from ml_kernel.predictor import (
    predict_topk,
    model_subject,
    model_grade,
    SUBJECT_LABELS,
    GRADE_LABELS,
    NodeFeatureBuilder
)

# -------- CONFIG --------
BASE = Path(__file__).parent
ROOT_DIR = BASE / "sample_test"
OUTPUT_CSV = BASE / "predictions.csv"

# ------------------------
nfb = NodeFeatureBuilder(device="cpu")

results = []
sample_id = 1

print("🚀 BẮT ĐẦU BATCH PREDICTION (SUBJECT + GRADE)")
print("=" * 70)

for subject_dir in ROOT_DIR.iterdir():
    if not subject_dir.is_dir():
        continue

    gt_subject = subject_dir.name
    print(f"\n📂 Đang xử lý môn (GT): {gt_subject}")

    for image_path in subject_dir.iterdir():
        if not image_path.is_file():
            continue

        if image_path.suffix.lower() not in [".jpg", ".png", ".jpeg"]:
            continue

        print(f"\n🔍 Sample {sample_id}")
        print(f"   🖼️  Image: {image_path.name}")
        print(f"   🎯 GT Subject: {gt_subject}")

        # ---- Build node feature ----
        node_feat = nfb.build(str(image_path))
        print(f"   🧠 Node feature shape: {tuple(node_feat.shape)}")

        # ---- Predict SUBJECT (top-1) ----
        subj_pred = predict_topk(
            node_feat,
            model_subject,
            SUBJECT_LABELS,
            topk=1
        )
        pred_subject, subject_prob = subj_pred[0]

        # ---- Predict GRADE (top-1) ----
        grade_pred = predict_topk(
            node_feat,
            model_grade,
            GRADE_LABELS,
            topk=1
        )
        pred_grade, grade_prob = grade_pred[0]

        # ---- Print prediction ----
        print(f"   🤖 Pred Subject: {pred_subject} ({subject_prob:.4f})")
        print(f"   🏷️  Pred Grade  : {pred_grade} ({grade_prob:.4f})")

        if pred_subject != gt_subject:
            print("   ❌ SUBJECT MISCLASSIFIED")

        print("-" * 50)

        # ---- Save result ----
        results.append([
            sample_id,
            str(image_path),
            gt_subject,
            pred_subject,
            round(subject_prob, 6),
            pred_grade,
            round(grade_prob, 6)
        ])

        sample_id += 1

print("\n📝 Đang ghi file CSV...")

# -------- Write CSV --------
with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow([
        "SampleID",
        "ImagePath",
        "GT_Subject",
        "Pred_Subject",
        "Subject_Prob",
        "Pred_Grade",
        "Grade_Prob"
    ])
    writer.writerows(results)

print(f"✅ HOÀN TẤT! Đã lưu kết quả vào: {OUTPUT_CSV}")
