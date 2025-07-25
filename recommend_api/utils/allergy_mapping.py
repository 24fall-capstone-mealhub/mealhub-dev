ALLERGY_MAPPING = {
    "diary": [
        "우유", "치즈", "버터", "요거트", "생크림", "요구르트"
    ],

    "egg": [
        "계란", "달걀", "마요네즈"
    ],

    "nuts": [
        "호두", "아몬드", "땅콩", "캐슈넛"
    ],

    "seafood": [
        "새우", "게", "대하", "크래미", "랍스터", "가재",
        "어묵", "맛살", "오뎅"
    ],

    "soy": [
        "두부", "콩", "된장", "간장", "두반장", "크래미",
        "훠궈", "춘장", "쯔유", "굴소스", "맛살", "청국장",
        "돈가스소스", "유부"
    ],

    "wheat": [
        "밀가루", "빵", "라면", "파스타", "만두", "만두피",
        "크래미", "어묵", "맛살", "두반장", "훠궈", "춘장",
        "칼국수", "소면", "면", "쯔유", "또띠아", "굴소스",
        "국수", "돈가스소스", "햄"
    ],

    "pepper": [
        "고추", "청양고추", "고춧가루", "고추장", "두반장",
        "페퍼론치노", "김치만두", "훠궈", "칠리소스", "김치", "땡초"
    ]
}

INGREDIENT_ALLERGY_MAP = {}
for category, ingredients in ALLERGY_MAPPING.items():
    for ing in ingredients:
        INGREDIENT_ALLERGY_MAP[ing] = category