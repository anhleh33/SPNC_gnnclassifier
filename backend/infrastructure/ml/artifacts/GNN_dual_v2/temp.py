import json

with open(r"D:\SPNC_gnnclassifier\backend\infrastructure\ml\artifacts\GNN_dual_v2\subject_labels.json", "r", encoding="utf-8") as f:
    subject_labels = json.load(f)

with open(r"D:\SPNC_gnnclassifier\backend\infrastructure\ml\artifacts\GNN_dual_v2\grade_labels.json", "r", encoding="utf-8") as f:
    grade_labels = json.load(f)

composite = {}
idx = 0

for s_id, subject in subject_labels.items():
    for g_id, grade in grade_labels.items():
        composite[str(idx)] = f"{subject} - {grade}"
        idx += 1

with open("composite_label_map.json", "w", encoding="utf-8") as f:
    json.dump(composite, f, ensure_ascii=False, indent=2)

print("Total composite classes:", len(composite))