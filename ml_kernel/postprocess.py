from typing import List, Tuple


def combine_subject_grade(
    subjects: List[Tuple[str, float]],
    grades: List[Tuple[int | str, float]],
    topk: int = 3,
) -> List[Tuple[str, float]]:
    """
    Combine subject and grade predictions via joint probability.

    Args:
        subjects: [(subject_name, probability)]
        grades: [(grade, probability)]
        topk: number of final pairs to return

    Returns:
        [("Subject – Lớp X", joint_probability)]
    """
    pairs: List[Tuple[str, float]] = []

    for subj, ps in subjects:
        for grade, pg in grades:
            joint_prob = float(ps) * float(pg)
            pairs.append(
                (f"{subj} – Lớp {grade}", joint_prob)
            )

    pairs.sort(key=lambda x: x[1], reverse=True)
    return pairs[:topk]
