// 인기 메뉴를 가져오는 API
export const fetchTrendingFoods = () => {
    console.log("인기 메뉴 API 호출");
    const token = localStorage.getItem('token');

    return new Promise((resolve, reject) => {
        fetch("https://mealhub.duckdns.org/backend/api/trending-foods", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`인기 메뉴 가져오기 실패: ${res.status} ${res.statusText}`);
            }
            try {
                // text 응답을 JSON으로 파싱
                return res.text().then(text => {
                    console.log("인기 메뉴 원본 응답:", text);
                    return JSON.parse(text);
                });
            } catch (error) {
                console.error("JSON 파싱 오류:", error);
                throw error;
            }
        })
        .then(data => {
            console.log("인기 메뉴 응답(파싱됨):", data);
            resolve(data);
        })
        .catch(error => {
            console.error("인기 메뉴 API 오류:", error);
            reject(error);
        });
    });
}; 