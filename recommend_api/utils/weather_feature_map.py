WEATHER_FEATRUE_MAP = {
    ("low", "low"): {  # 추움 + 건조
        "soup": 1.3, "greasy": 1.2, "hot": 1.2, "spicy": 1.1,
        "cold": 0.8, "fried": 1.0, "sweet": 1.1
    },
    ("low", "mid"): {  # 추움 + 쾌적
        "soup": 1.2, "greasy": 1.2, "spicy": 1.1,
        "cold": 0.9
    },
    ("low", "high"): {  # 추움 + 습함 (겨울비, 눈)
        "soup": 1.2, "fried": 1.1, "greasy": 1.2, "sweet": 1.0
    },
    ("mid", "low"): {  # 선선 + 건조
        "soup": 1.1, "sweet": 1.1
    },
    ("mid", "mid"): {  # 쾌적
        # 기본값 유지 (1.0)
    },
    ("mid", "high"): {  # 장마, 흐림
        "spicy": 1.1, "fried": 1.1, "cold": 1.0
    },
    ("high", "low"): {  # 덥고 건조
        "cold": 1.2, "sweet": 1.1, "soup": 1.0, "greasy": 0.9
    },
    ("high", "mid"): {  # 더움
        "cold": 1.2, "soup": 0.9, "fried": 0.9
    },
    ("high", "high"): {  # 찜통더위
        "cold": 1.3, "spicy": 1.1, "fried": 0.8, "soup": 0.8, "greasy": 0.8
    },
}

def classify_temp(temp):
    if temp <= 10:
        return "low"
    elif temp >= 26:
        return "high"
    return "mid"

def classify_humidity(humid):
    if humid <= 40:
        return "low"
    elif humid >= 71:
        return "high"
    return "mid"

def get_weather_feature_map(temp, humid):
    t = classify_temp(temp)
    h = classify_humidity(humid)
    return WEATHER_FEATRUE_MAP.get((t, h), {})