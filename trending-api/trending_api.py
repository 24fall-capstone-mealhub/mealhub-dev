from flask import Flask, jsonify
from pytrends.request import TrendReq
from itertools import islice
import threading
import time
import logging
import numpy as np

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s - %(message)s"
)

app = Flask(__name__)

cached_data = []
data_ready = False

food_keywords = [
    "갈비찜", "갈비탕", "감바스", "게장", "고기만두", "곰탕", "곱창구이", "곱창볶음", "곱창전골", "군만두",
    "규카츠", "기스면", "김밥", "깐풍기", "나베", "낙지볶음", "낙지전골", "닭갈비", "닭발", "닭볶음탕",
    "돈까스", "돼지고기 구이", "돼지고기 덮밥", "돼지국밥", "돼지불고기", "두부전골", "떡볶이", "라멘",
    "라면", "마라탕", "마파두부", "막국수", "막창구이", "매운탕", "메밀국수", "메밀소바", "멘보샤",
    "물냉면", "물만두", "물회", "밀면", "백숙", "버거", "볶음밥", "볶음우동", "부대찌개", "비빔국수",
    "비빔냉면", "비빔밥", "삼겹살", "삼계탕", "샤브샤브", "쌀국수", "우동", "울면", "월남쌈", "육개장",
    "육회비빔밥", "잔치국수", "잡채밥", "장어구이", "장어덮밥", "쟁반짜장", "제육볶음", "짜장면", "짜장밥",
    "짬뽕", "쫄면", "찜닭", "차돌박이구이", "초밥", "치킨", "칼국수", "콩국수", "탄탄면", "탕수육",
    "토스트", "파스타", "파전", "피자"
]

REFERENCE_KEYWORD = "치킨"

def chunked(iterable, size):
    it = iter(iterable)
    return iter(lambda: list(islice(it, size)), [])

def fetch_trending_data():
    global cached_data, data_ready
    data_ready = False
    pytrends = TrendReq(hl='ko', tz=540)
    results = {}

    logging.info("📡 트렌드 데이터 수집 시작")

    for group in chunked(food_keywords, 4):
        if REFERENCE_KEYWORD not in group:
            group.insert(0, REFERENCE_KEYWORD)
        try:
            pytrends.build_payload(group, timeframe='now 1-d')
            data = pytrends.interest_over_time()
            logging.info(f"[QUERY] {group}")

            if not data.empty and REFERENCE_KEYWORD in data:
                ref_values = data[REFERENCE_KEYWORD]
                for keyword in group:
                    if keyword != REFERENCE_KEYWORD and keyword in data:
                        # ref가 0보다 큰 시간대만 선택
                        valid_idx = ref_values > 0
                        if valid_idx.any():
                            norm = np.log1p(data[keyword][valid_idx]) / np.log1p(ref_values[valid_idx]) * 100
                            mean_score = norm.mean()
                            logging.info(f"{keyword} normalized score: {mean_score:.2f}")
                            results[keyword] = mean_score
                        else:
                            logging.warning(f"[SKIP] {keyword} → 기준 값 모두 0 (ref_values={ref_values.tolist()})")
            else:
                logging.warning(f"[EMPTY] {group} → 기준 키워드 또는 데이터 없음")
        except Exception as e:
            logging.error(f"[ERROR] {group} → {e}")
        time.sleep(30)

    top10 = sorted(results.items(), key=lambda x: x[1], reverse=True)[:10]
    cached_data.clear()
    cached_data.extend([{"name": name, "score": round(score, 2)} for name, score in top10])

    data_ready = True
    logging.info("✅ 트렌드 데이터 수집 완료 및 캐싱 완료")

def auto_refresh(interval=3600):
    def loop():
        while True:
            fetch_trending_data()
            time.sleep(interval)
    thread = threading.Thread(target=loop, daemon=True)
    thread.start()

@app.route("/api/trending-foods", methods=["GET"])
def get_trending_foods():
    if not data_ready:
        return jsonify({
            "status": "loading",
            "message": "트렌드 데이터를 수집 중입니다. 잠시 후 다시 시도해 주세요."
        }), 503
    if not cached_data:
        return jsonify({
            "status": "empty",
            "message": "데이터가 수집되지 않았습니다."
        }), 204
    return jsonify(cached_data)

if __name__ == "__main__":
    logging.info("🟢 서버 시작과 동시에 트렌드 데이터 수집을 시작합니다.")
    auto_refresh()
    app.run(host="0.0.0.0", port=5000)
