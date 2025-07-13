export const fetchPartyCreate = () => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('token');
    
    return new Promise((resolve, reject) => {
        fetch("https://mealhub.duckdns.org/backend/party/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            }
        })
        .then(res => {
            console.log("서버 응답:", res);
            return res.text();
        })
        .then(body => {
            console.log("응답 바디 : ", body);
            
            // 콜론 뒤의 코드만 슬라이싱
            const colonIndex = body.indexOf(':');
            const partyCode = colonIndex !== -1 ? body.slice(colonIndex + 1).trim() : body.trim();
            
            // 추출된 파티 코드를 대문자로 변환
            const upperCaseCode = partyCode.toUpperCase();
            console.log("추출된 파티 코드:", upperCaseCode);
            resolve(upperCaseCode);
        })
        .catch(error => {
            console.error("파티 생성 실패:", error);
            reject(error);
        });
    });
}

export const fetchPartyJoin = (code) => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('token');
    
    return new Promise((resolve, reject) => {
        fetch('https://mealhub.duckdns.org/backend/party/join', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ""
            },
            credentials: 'include',
            body: JSON.stringify({code: code.toUpperCase()})
        })
        .then(response => response.text())
        .then(text => {
            console.log(text);
            resolve(text); // 전체 응답 텍스트 반환
        })
        .catch(error => {
            console.error('파티 참가 실패:', error);
            reject(error);
        });
    });
}

// 파티 멤버 목록 가져오기
export const fetchPartyMembers = (userId) => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('token');
    
    return new Promise((resolve, reject) => {
        fetch(`https://mealhub.duckdns.org/backend/party/party/list?userId=${userId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ""
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API 응답 오류: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('파티 멤버 목록:', data);
            resolve(data);
        })
        .catch(error => {
            console.error('파티 멤버 목록 가져오기 실패:', error);
            reject(error);
        });
    });
}

// 내가 속한 파티 코드 조회하기
export const fetchMyParty = () => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('token');
    
    return new Promise((resolve, reject) => {
        // 토큰이 없으면 파티 정보가 없는 것으로 처리
        if (!token) {
            resolve(null);
            return;
        }
        
        fetch('https://mealhub.duckdns.org/backend/party/myparty', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 400) {
                    // 파티가 없는 경우 (404)
                    resolve(null);
                    return;
                }
                throw new Error(`API 응답 오류: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log('내 파티 코드:', data);
            // 응답이 없거나 빈 문자열이면 null 반환
            resolve(data && data.trim() ? data.trim() : null);
        })
        .catch(error => {
            console.error('내 파티 조회 실패:', error);
            reject(error);
        });
    });
}

// 파티 나가기
export const leaveParty = (partyCode) => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('token');
    
    return new Promise((resolve, reject) => {
        // 토큰이 없으면 오류 처리
        if (!token) {
            reject(new Error('로그인이 필요합니다'));
            return;
        }
        
        fetch('https://mealhub.duckdns.org/backend/party/leave', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ code: partyCode })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API 응답 오류: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log('파티 나가기 응답:', data);
            resolve(true);
        })
        .catch(error => {
            console.error('파티 나가기 실패:', error);
            reject(error);
        });
    });
}

// 파티 삭제하기 (호스트용)
export const deleteParty = (partyCode) => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('token');
    
    return new Promise((resolve, reject) => {
        // 토큰이 없으면 오류 처리
        if (!token) {
            reject(new Error('로그인이 필요합니다'));
            return;
        }
        
        fetch('https://mealhub.duckdns.org/backend/party/delete', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ code: partyCode })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API 응답 오류: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log('파티 삭제 응답:', data);
            resolve(true);
        })
        .catch(error => {
            console.error('파티 삭제 실패:', error);
            reject(error);
        });
    });
}
