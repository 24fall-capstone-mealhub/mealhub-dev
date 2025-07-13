import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import Party from '../components/Party';
import Trends from '../components/Trends';
import Map from '../components/Map';
import Header from '../components/Header';
import FoodRecommendation from '../components/FoodRecommendation';
import LoadingOverlay from "../components/LoadingOverlay";
import GuestInfoModal from '../components/GuestInfoModal';

import useScroll from '../hooks/useScroll';
import useUserInfo from '../hooks/useUserInfo';
import foodData from '../menu.json';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { fetchPartyCreate, fetchPartyJoin, fetchPartyMembers, fetchMyParty, leaveParty, deleteParty } from '../api/party';
import { fetchTrendingFoods } from '../api/trending';

const HomeContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: var(--background-color);
  position: relative;
  overflow-x: hidden;
`;

const ContentContainer = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const TrendsContainer = styled(motion.div)`
  padding: 20px;
  margin-top: 30px;
`;

const TrendsTitle = styled(motion.h2)`
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 40px;
    height: 3px;
    background: var(--primary-color);
    border-radius: 2px;
  }
`;

const MapContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
`;

// 애니메이션 변수
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const slideUpVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30
    }
  },
  exit: { 
    y: "100%", 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

function Home() {
  const containerRef = useRef(null);
  useScroll(containerRef, "vertical");

  const [load, setLoad] = useState(false);
  const [code, setCode] = useState("");
  const [participants, setParticipants] = useState(['정종욱', '하천수', '이서진']);
  
  // 전체 추천 결과 배열 저장
  const [recommendations, setRecommendations] = useState([]);
  // 현재 표시 중인 추천 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);
  // 현재 표시할 메뉴 정보
  const [result, setResult] = useState({menu_id: null, menu_name: '', imageUrl: ''});
  // 현재 추천 세션 카운트 (첫 번째 세션에서만 피드백 전송)
  const [sessionCount, setSessionCount] = useState(1);

  const [view, setVie] = useState({
    showParty: 0,
    showRec: false,
    showMap: false,
  });

  // 게스트 정보 모달 상태
  const [showGuestInfoModal, setShowGuestInfoModal] = useState(false);
  // 게스트 정보 저장
  const [guestId, setGuestId] = useState(null);

  // 로그인 여부 확인을 위한 훅
  const { userInfo, loading: userLoading } = useUserInfo();

  // 컴포넌트 마운트 시 저장된 게스트 정보가 있는지 확인
  useEffect(() => {
    const savedGuestId = localStorage.getItem('guestId');
    console.log("savedGuestId:", savedGuestId);
    if (savedGuestId) {
      setGuestId(savedGuestId);
    }
  }, []);
  
  // 로딩 메시지 상태 추가
  const [loadingMessage, setLoadingMessage] = useState("메뉴를 추천하는 중...");

  const setView = (key, value) => {
    setVie((prev) => ({
      ...prev,
      [key]: value,
    }))
  };

  // 초기 화면으로 돌아가는 함수
  const resetHome = () => {
    // 추천 화면 숨기기
    setView('showRec', false);
    // 지도 숨기기
    setView('showMap', false);
    // 파티 화면 숨기기
    setView('showParty', 0);
  };

  const [isHeightChanged, setIsHeightChanged] = useState(false);
  const [isFixed, setIsFixed] = useState(true);

  const loginId = localStorage.getItem("loginId");
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();
  
  const [trendsRef, trendsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // 인기 메뉴 데이터 상태 추가
  const [trendingFoods, setTrendingFoods] = useState([]);
  const [loadingTrends, setLoadingTrends] = useState(false);

  // 피드백 중복 제출 방지를 위한 ref 추가
  const skippedMenusRef = useRef(new Set());

  // 게스트 정보 저장 처리
  const handleGuestIdSubmit = (data) => {
    setGuestId(data);
    localStorage.setItem('guestId', data);
    setShowGuestInfoModal(false);
    
    // // 게스트 정보 입력 후 바로 추천 시작
    // if (userLocation) {
    //   fetchRecommendation(userLocation.lat, userLocation.lng);
    // } else {
    //   getLocation();
    // }
  };

  const getLocation = () => {
    setLoadingMessage("위치 정보를 가져오는 중...");
    setLoad(true);
    console.log("위치 정보 요청 시작");
    
    if (navigator.geolocation) {
      const geoOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("위치 정보 획득 성공");
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
          setUserLocation({
            lat: latitude,
            lng: longitude
          });
          
          setLoad(false);
        },
        (error) => {
          console.error("위치 정보 획득 실패:", error.code, error.message);
          // 에러 코드별 메시지 처리
          let errorMessage = "";
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "위치 정보 접근 권한이 거부되었습니다.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "위치 정보를 사용할 수 없습니다.";
              break;
            case error.TIMEOUT:
              errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
              break;
            default:
              errorMessage = "알 수 없는 오류가 발생했습니다.";
          }
          
          alert(errorMessage);
          
          // 기본 위치로 서울 설정
          setUserLocation({
            lat: 37.5665,
            lng: 126.9780
          });
          
          setLoad(false);
        },
        geoOptions
      );
    } else {
      console.error("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
      alert("이 브라우저에서는 위치 정보가 지원되지 않습니다. 기본 위치(서울)로 설정합니다.");
      
      setUserLocation({
        lat: 37.5665,
        lng: 126.9780
      });
      
      setLoad(false);
    }
  };

  useEffect(() => {
    if (!userLocation) return;
    
    // 로그인하지 않았고 게스트 정보도 없으면 게스트 정보 모달 표시
    if (!userInfo && !guestId && !userLoading) {
      setShowGuestInfoModal(true);
    } else {
      fetchRecommendation(userLocation.lat, userLocation.lng);
    }
  }, [userLocation, userInfo, guestId, userLoading]);

  const fetchRecommendation = (lat, lng) => {
    // 새로운 추천을 요청할 때 스킵된 메뉴 목록 초기화
    skippedMenusRef.current.clear();
    
    // 모든 추천을 소진한 후 새로운 추천을 요청하는 경우, 세션 카운트 증가
    if (recommendations.length > 0 && currentIndex >= recommendations.length - 1) {
      setSessionCount(prev => prev + 1);
    }
    
    setLoadingMessage("메뉴를 추천하는 중...");
    setLoad(true);
    
    // API 요청 데이터 준비
    const requestData = {
      lat: lat,
      lon: lng,
      timestamp: new Date().toISOString().slice(0,-1),
    };
    
    let isGroup = false;

    const proceedFetch = () => {
      console.log("최종 requestData:", requestData);
      const apiUrl = isGroup ? "https://mealhub.duckdns.org/api/recommend/group"
                              : "https://mealhub.duckdns.org/api/recommend/";
      
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`API 응답 오류: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(body => {
        console.log("추천 응답 데이터:", body);
        
        // 응답 데이터 유효성 검사
        if (!body || !body.recommendations || body.recommendations.length === 0) {
          throw new Error('유효한 추천 데이터가 없습니다.');
        }
        
        // 모든 추천 결과 저장
        setRecommendations(body.recommendations);
        // 인덱스 초기화
        setCurrentIndex(0);
        
        // 첫 번째 추천 메뉴 표시
        const firstRecommendation = body.recommendations[0];
        if (!firstRecommendation.menu_name || !firstRecommendation.menu_id) {
          throw new Error('필수 메뉴 정보가 없습니다.');
        }
        
        const menuName = firstRecommendation.menu_name;
        setResult({
          menu_id: firstRecommendation.menu_id,
          menu_name: menuName,
          imageUrl: foodData[menuName]?.url || 'https://via.placeholder.com/400x300?text=음식+이미지'
        });
        setView('showRec', true);
      })
      .catch(err => {
        console.error("추천 요청 오류:", err.message || err);
        
        // 임시 데이터로 처리 (API 실패시)
        const fallbackMenus = ["비빔밥", "김치찌개", "삼겹살", "불고기", "냉면"];
        const randomIndex = Math.floor(Math.random() * fallbackMenus.length);
        const tempMenu = fallbackMenus[randomIndex];
        
        // 임시 데이터도 배열 형태로 저장
        const tempRecommendations = fallbackMenus.map((menu, idx) => ({
          menu_id: idx + 1,
          menu_name: menu
        }));
        
        setRecommendations(tempRecommendations);
        setCurrentIndex(randomIndex);
        
        setResult({
          menu_id: randomIndex + 1,
          menu_name: tempMenu,
          imageUrl: foodData[tempMenu]?.url || 'https://via.placeholder.com/400x300?text=음식+이미지'
        });
        setView('showRec', true);
      })
      .finally(() => {
        setLoad(false);
      });
    }

    // 로그인 사용자의 경우 user_id 추가
    if (userInfo && userInfo.id) {
      fetchPartyMembers(userInfo.id)
        .then(partyMembers => {
          if (partyMembers && partyMembers.length > 0) {
            requestData.user_id = partyMembers;
            isGroup = true;
          } else {
            requestData.user_id = [userInfo.id];
          }
        })
        .catch(err => {
          console.error("파티 멤버 정보 가져오기 오류:", err);
          // 파티 멤버 정보가 없으면 로그인 사용자 ID만 사용
          requestData.user_id = [userInfo.id];
        })
        .finally(() => {
          proceedFetch();
        });
    } 
    // 게스트 사용자의 경우 게스트 정보 추가
    else if (guestId) {
      requestData.user_id = [parseInt(guestId, 10)];
      proceedFetch();
    }
    // 아무 정보도 없는 경우
    else {
      requestData.user_id = ['guest'];
      proceedFetch();
    }
  };

  const skipMenu = () => {
    if (!result || !result.menu_id) {
      console.error("스킵할 메뉴 정보가 없습니다.");
      return;
    }
    
    // 다음 인덱스 계산
    const nextIndex = currentIndex + 1;
    const isLastRecommendation = nextIndex >= recommendations.length;
    
    // 지도가 보이지 않는 상태이고, 이전에 스킵하지 않은 메뉴일 때, 
    // 그리고 첫 번째 세션일 때만 피드백 전송
    if (!view.showMap && !skippedMenusRef.current.has(result.menu_id) && sessionCount === 1) {
      // 사용자 ID 확인 (로그인 사용자 또는 게스트)
      let userId = null;
      if (userInfo && userInfo.id) {
        userId = userInfo.id;
      } else {
        // localStorage에서 게스트 ID 확인
        const guestId = localStorage.getItem('guestId');
        if (guestId) {
          userId = parseInt(guestId, 10);
        }
      }
      
      // 사용자 ID가 있을 경우에만 피드백 전송
      if (userId) {
        // 현재 메뉴 ID를 스킵 목록에 추가
        skippedMenusRef.current.add(result.menu_id);
        
        fetch("https://mealhub.duckdns.org/api/feedback/skip", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: [userId],
            menu_id: result.menu_id,
            timestamp: new Date().toISOString().slice(0, -1),
            lat: userLocation?.lat || 37.5665,
            lon: userLocation?.lng || 126.9780
          })
        })
        .then(res => {
          if (!res.ok) {
            console.error("피드백 전송 실패:", res.status, res.statusText);
          } else {
            console.log("피드백 전송 성공");
          }
        })
        .catch(err => console.error("피드백 전송 오류:", err));
      } else {
        console.log("사용자 ID가 없어 피드백을 전송하지 않습니다.");
      }
    } else {
      const reason = view.showMap 
        ? "지도가 보이는 상태" 
        : (skippedMenusRef.current.has(result.menu_id) 
          ? "이미 스킵한 메뉴" 
          : (sessionCount > 1 
            ? "첫 번째 세션이 아님" 
            : "마지막 추천 메뉴"));
      console.log(`피드백 전송 건너뜀: ${reason}`);
    }

    // 지도 숨기기
    setView('showMap', false);
    
    // 추천 결과가 남아있으면 다음 항목 표시
    if (!isLastRecommendation) {
      // 다음 메뉴로 이동할 때는 로딩 필요 없음
      setCurrentIndex(nextIndex);
      const nextRecommendation = recommendations[nextIndex];
      const menuName = nextRecommendation.menu_name;
      
      setResult({
        menu_id: nextRecommendation.menu_id,
        menu_name: menuName,
        imageUrl: foodData[menuName]?.url || 'https://via.placeholder.com/400x300?text=음식+이미지'
      });
    } else {
      // 추천 결과를 모두 소진했으면 새로운 추천 요청
      console.log("추천 결과를 모두 소진하여 새로운 추천을 요청합니다.");
      setLoadingMessage("새로운 메뉴를 추천하는 중...");
      setLoad(true);
      if (userLocation) {
        fetchRecommendation(userLocation.lat, userLocation.lng);
      } else {
        // 위치 정보가 없는 경우 기본 위치로 요청
        console.log("위치 정보가 없어 기본 위치로 요청합니다.");
        fetchRecommendation(37.5665, 126.9780);
      }
    }
  };

  // 이전 메뉴 보기 함수
  const previousMenu = () => {
    if (!result || !result.menu_id) {
      console.error("이전 메뉴 정보가 없습니다.");
      return;
    }
    
    // 현재 인덱스가 0보다 크면 이전 인덱스로 이동
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      
      const prevRecommendation = recommendations[prevIndex];
      const menuName = prevRecommendation.menu_name;
      
      setResult({
        menu_id: prevRecommendation.menu_id,
        menu_name: menuName,
        imageUrl: foodData[menuName]?.url || 'https://via.placeholder.com/400x300?text=음식+이미지'
      });
    } else {
      console.log("이미 첫 번째 추천 메뉴입니다.");
    }
  };

  useEffect(() => {
    if (calculateTotalHeight() <= window.innerHeight) setIsFixed(true);
    else setIsFixed(false);
    setIsHeightChanged(false);
  }, [isHeightChanged]);

  const calculateTotalHeight = () => {
    if (containerRef.current) {
      const children = Array.from(containerRef.current.children);
      const totalHeight = children.reduce((sum, child) => sum + child.offsetHeight, 0);
      return totalHeight;
    }
    return 0;
  };

  // 파티 토글 이벤트 수신 리스너 추가
  useEffect(() => {
    const handleToggleParty = () => {
      setView('showParty', view.showParty === 0 ? 1 : 0);
    };

    // 이벤트 리스너 등록
    window.addEventListener('toggleParty', handleToggleParty);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('toggleParty', handleToggleParty);
    };
  }, [view.showParty]);
  
  // getLocation 이벤트 리스너 추가
  useEffect(() => {
    const handleGetLocation = () => {
      console.log("getLocation 이벤트 발생");
      if (!userInfo && userLoading) {
        alert("유저 정보를 불러오는 중입니다...");
      } else {
        getLocation();
      }
    };
    
    // 이벤트 리스너 등록
    window.addEventListener('getLocation', handleGetLocation);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('getLocation', handleGetLocation);
    };
  }, [userInfo, userLoading, getLocation]);

  // 인기 메뉴 데이터 가져오기
  useEffect(() => {
    setLoadingTrends(true);
    
    fetchTrendingFoods()
      .then(data => {
        console.log("인기 메뉴 데이터:", data);
        setTrendingFoods(data);
      })
      .catch(error => {
        console.error("인기 메뉴 데이터 가져오기 오류:", error);
        // 오류 발생 시 기본 데이터 설정 (선택 사항)
        setTrendingFoods([]);
      })
      .finally(() => {
        setLoadingTrends(false);
      });
  }, []);

  // "처음부터 추천 받기" 버튼을 클릭할 때 세션 카운트 초기화
  const getNewRecommendation = () => {
    setSessionCount(1); // 세션 카운트 초기화
    const getLocationEvent = new CustomEvent('getLocation');
    window.dispatchEvent(getLocationEvent);
  };

  return (
    <HomeContainer
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {load && <LoadingOverlay message={loadingMessage} />}
      
      <Header resetHome={resetHome} showPartyButton={!view.showRec} />
      
      <ContentContainer>
        <AnimatePresence>
          <Party
            showParty={view.showParty}
            setShowParty={(value) => setView('showParty', value)}
            code={code}
            setCode={setCode}
            fetchPartyCreate={fetchPartyCreate}
            fetchPartyJoin={fetchPartyJoin}
            fetchPartyMembers={fetchPartyMembers}
            fetchMyParty={fetchMyParty}
            leaveParty={leaveParty}
            deleteParty={deleteParty}
          />
        </AnimatePresence>
        
        <FoodRecommendation 
          showRec={view.showRec}
          result={result}
          userInfo={userInfo}
          skipMenu={skipMenu}
          previousMenu={previousMenu}
          setView={setView}
          setIsHeightChanged={setIsHeightChanged}
          showMap={view.showMap}
          currentIndex={currentIndex}
          getNewRecommendation={getNewRecommendation}
        />
        
        <AnimatePresence>
          {view.showMap && (
            <MapContainer
              variants={slideUpVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Map
                userLocation={userLocation}
                resultMenu={result.menu_name}
                menuId={result.menu_id}
              />
            </MapContainer>
          )}
        </AnimatePresence>
        
        {!view.showRec && !view.showMap && (
          <TrendsContainer
            ref={trendsRef}
            variants={fadeInVariants}
            initial="hidden"
            animate={trendsInView ? "visible" : "hidden"}
          >
            <TrendsTitle variants={itemVariants}>현재 인기 메뉴</TrendsTitle>
            <Trends 
              trendingFoods={trendingFoods}
              loading={loadingTrends}
              foodData={foodData}
            />
          </TrendsContainer>
        )}
      </ContentContainer>
      
      {/* 게스트 정보 입력 모달 */}
      <GuestInfoModal 
        isOpen={showGuestInfoModal}
        onClose={() => setShowGuestInfoModal(false)}
        onSubmit={handleGuestIdSubmit}
      />
    </HomeContainer>
  );
}

export default Home;