import { useState, useEffect } from 'react';

const CACHE_KEY = 'cached_user_info';
const CACHE_EXPIRY_KEY = 'cached_user_info_expiry';
const CACHE_EXPIRY_TIME = 1000 * 60 * 30; // 30분 캐시 유효 시간

const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUserInfo = async () => {
            // 로컬 스토리지에서 토큰 체크
            const token = localStorage.getItem('token');
            if (!token) {
                setError('토큰이 없습니다.');
                setLoading(false);
                return;
            }
            
            // 캐시된 유저 정보 확인
            const cachedUserInfo = localStorage.getItem(CACHE_KEY);
            const cachedExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
            const now = Date.now();
            
            // 캐시가 유효하면 바로 사용
            if (cachedUserInfo && cachedExpiry && now < parseInt(cachedExpiry)) {
                console.log("mmmm",cachedUserInfo);
                try {
                    const parsedUserInfo = JSON.parse(cachedUserInfo);
                    console.log("캐시된 사용자 정보 사용:", parsedUserInfo);
                    setUserInfo(parsedUserInfo);
                    setLoading(false);
                    return;
                } catch (e) {
                    // 캐시 파싱 오류 시 캐시 삭제
                    console.error("캐시된 사용자 정보 파싱 오류:", e);
                    localStorage.removeItem(CACHE_KEY);
                    localStorage.removeItem(CACHE_EXPIRY_KEY);
                }
            }
            
            // 캐시가 없거나 만료되었을 경우 서버에서 새로 요청
            try {
                console.log("서버에서 사용자 정보 요청 중");
                const response = await fetch("https://mealhub.duckdns.org/backend/user/info", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
          
                if (!response.ok) {
                    throw new Error("유저 정보를 불러오지 못했습니다.");
                }
              
                const data = await response.json();
                console.log("서버에서 받은 사용자 정보:", data);
                
                // 새로 받은 정보 캐싱
                localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                localStorage.setItem(CACHE_EXPIRY_KEY, (now + CACHE_EXPIRY_TIME).toString());
                
                setUserInfo(data);
            } catch (error) {
                console.error("사용자 정보 요청 오류:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        loadUserInfo();
    }, []);
    
    // 캐시 갱신 함수 (로그인/로그아웃 후에 호출 가능)
    const refreshUserInfo = async () => {
        setLoading(true);
        
        // 캐시 삭제
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_EXPIRY_KEY);
        
        const token = localStorage.getItem('token');
        if (!token) {
            setUserInfo(null);
            setError('토큰이 없습니다.');
            setLoading(false);
            return;
        }
        
        try {
            const response = await fetch("https://mealhub.duckdns.org/backend/user/info", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
      
            if (!response.ok) {
                throw new Error("유저 정보를 불러오지 못했습니다.");
            }
          
            const data = await response.json();
            console.log(data);
            
            // 새로 받은 정보 캐싱
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_EXPIRY_TIME).toString());
            
            setUserInfo(data);
            setError(null);
        } catch (error) {
            setError(error);
            setUserInfo(null);
        } finally {
            setLoading(false);
        }
    };

    return { userInfo, loading, error, refreshUserInfo };
};

export default useUserInfo;