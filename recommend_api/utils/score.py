import math

def calculate_adjusted_score(satisfied_count: int, skipped_count: int) -> float:
    total = satisfied_count + skipped_count
    if total == 0:
        return 3.0
    satisfaction_ratio = satisfied_count / total
    confidence = math.log(1 + total)
    adjusted_score = satisfaction_ratio * confidence
    final_score = 3.0 + (adjusted_score / math.log(1 + 100)) * 2.0
    return min(final_score, 5.0)