// 게스트 정보 초기화 API
export const initGuest = (guestData) => {
    console.log("게스트 초기화 API 호출:", guestData);
    
    return new Promise((resolve, reject) => {
        fetch("https://mealhub.duckdns.org/backend/guest/init", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                age: guestData.age,
                gender: guestData.gender,
                dairy_allergy: guestData.dairy_allergy,
                eggs_allergy: guestData.eggs_allergy,
                nuts_allergy: guestData.nuts_allergy,
                seafood_allergy: guestData.seafood_allergy,
                soy_allergy: guestData.soy_allergy,
                wheat_allergy: guestData.wheat_allergy,
                pepper_allergy: guestData.pepper_allergy
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`게스트 초기화 실패: ${res.status} ${res.statusText}`);
            }
            return res.text();
        })
        .then(text => {
            console.log(text);
            
            const match = text.match(/userId=(\d+)/);
            if (match && match[1]) {
                const userId = parseInt(match[1], 10);
                console.log("게스트 초기화 성공:", userId);
                resolve(userId);
            } else {
                throw new Error("게스트 초기화 실패: 사용자 ID를 추출할 수 없습니다.");
            }
        })
        .catch(error => {
            console.error("게스트 초기화 오류:", error);
            reject(error);
        });
    });
}; 

// 게스트 정보 체크 API
export const checkGuest = () => {
    console.log("게스트 체크 API 호출:");
    
    return new Promise((resolve, reject) => {
        fetch(`https://mealhub.duckdns.org/backend/guest/check`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            console.log(res);
            return res.text();
        })
        .then(text => {
            console.log("게스트 체크 결과:", text);

            const match = text.match(/userId=(\d+)/);
            if (match && match[1]) {
                const userId = parseInt(match[1], 10);
                resolve(userId);
            } else {
                reject("게스트 체크 실패: 사용자 ID를 추출할 수 없습니다.");
            }
        })
        .catch(error => {
            console.error("게스트 체크 오류:", error);
            reject(error);
        });
        // .then(res => {
        //     if (!res.ok) {
        //         throw new Error(`게스트 체크 실패: ${res.status} ${res.statusText}`);
        //     }
        //     return res.json();
        // })
        // .then(data => {
        //     console.log("게스트 체크 성공:", data);
        //     resolve(data);
        // })
        // .catch(error => {
        //     console.error("게스트 체크 오류:", error);
        //     reject(error);
        // });
    });
}; 