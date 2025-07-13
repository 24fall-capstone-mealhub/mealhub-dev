from datetime import datetime

def convert_timestamp_to_slot(timestamp_str: str) -> str:
    dt = datetime.fromisoformat(timestamp_str)
    hour = dt.hour
    if 6 <= hour < 11:
        return "breakfast"
    elif 11 <= hour < 15:
        return "lunch"
    elif 15 <= hour < 18:
        return "snack"
    elif 18 <= hour < 22:
        return "dinner"
    else:
        return "late_night"