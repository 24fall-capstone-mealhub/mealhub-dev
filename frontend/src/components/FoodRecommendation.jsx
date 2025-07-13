import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const RecommendationContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  margin-top: 20px;
  width: 100%;
  position: relative;
`;

const PrevButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  width: 40px;
  height: 40px;
  background: rgba(255, 107, 53, 0.1);
  color: var(--primary-color);
  border: none;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 107, 53, 0.2);
    transform: translateY(-2px);
  }
  
  i {
    margin: 0;
  }
`;

const Title = styled(motion.h2)`
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 30px;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: var(--primary-color);
    border-radius: 2px;
  }
`;

const MenuName = styled(motion.div)`
  font-size: 34px;
  font-weight: 800;
  color: var(--primary-color);
  margin: 15px 0 25px;
  text-align: center;
  
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    bottom: -5px;
    left: -10px;
    right: -10px;
    height: 50%;
    background: rgba(255, 107, 53, 0.1);
    transform: skew(-15deg);
  }
`;

const FoodImageContainer = styled(motion.div)`
  width: 100%;
  max-width: 320px;
  height: 260px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--box-shadow-md);
  margin-bottom: 30px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6));
    z-index: 1;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 300px;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  background: ${props => props.primary ? 'var(--primary-color)' : 'white'};
  color: ${props => props.primary ? 'white' : 'var(--primary-color)'};
  border: ${props => props.primary ? 'none' : '2px solid var(--primary-color)'};
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: var(--box-shadow-sm);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--box-shadow-md);
    background: ${props => props.primary ? 'var(--primary-dark)' : 'rgba(255, 122, 0, 0.1)'};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  i {
    font-size: 18px;
  }
`;

const EmptyState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  
  h3 {
    margin: 20px 0 10px;
    font-size: 22px;
    color: var(--text-primary);
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: 30px;
    max-width: 300px;
  }
`;

const IconBackground = styled(motion.div)`
  width: 80px;
  height: 80px;
  background: rgba(255, 122, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  
  i {
    font-size: 36px;
    color: var(--primary-color);
  }
`;

// 애니메이션 변수
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2
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

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
};

const FoodRecommendation = ({ showRec, result, userInfo, skipMenu, previousMenu, setView, setIsHeightChanged, showMap, currentIndex, getNewRecommendation }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // 새로운 추천을 받는 함수 사용
  const handleGetNewRecommendation = () => {
    if (getNewRecommendation) {
      getNewRecommendation();
    } else {
      // 이전 방식으로 폴백
      const getLocationEvent = new CustomEvent('getLocation');
      window.dispatchEvent(getLocationEvent);
    }
  };
  
  if (!showRec) {
    return (
      <EmptyState
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <IconBackground
          animate={pulseAnimation}
        >
          <i className="fa-solid fa-utensils"></i>
        </IconBackground>
        <h3>오늘 뭐 먹지?</h3>
        <p>배고픈 당신을 위한 맞춤 메뉴 추천</p>
        <ActionButton 
          primary
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGetNewRecommendation}
        >
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          추천 받기
        </ActionButton>
      </EmptyState>
    );
  }
  
  return (
    <RecommendationContainer
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {/* 이전 메뉴 보기 버튼 */}
      {!showMap && currentIndex > 0 && (
        <PrevButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={previousMenu}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </PrevButton>
      )}
      
      <Title variants={itemVariants}>오늘의 추천 메뉴</Title>
      
      <MenuName 
        variants={itemVariants}
        animate={{ scale: [1, 1.02, 1], transition: { duration: 2, repeat: Infinity }}}
      >
        {result.menu_name}
      </MenuName>
      
      <FoodImageContainer
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <motion.img 
          src={result.imageUrl} 
          alt={result.menu_name}
          initial={{ scale: 1.2, rotate: -3 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </FoodImageContainer>
      
      <ButtonContainer>
        <ActionButton
          primary
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setView('showMap', true);
            setIsHeightChanged(true);
          }}
        >
          <i className="fa-solid fa-map-location-dot"></i>
          주변 식당 찾기
        </ActionButton>
        
        {/* 지도가 보이는지 여부에 따라 버튼 텍스트와 동작 변경 */}
        <ActionButton
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // 지도가 보이는 상태면 새로운 추천 받기
            if (showMap) {
              // 지도 숨기기
              setView('showMap', false);
              // 새로운 추천 받기
              handleGetNewRecommendation();
            } else {
              // 지도가 안 보이는 상태면 다음 메뉴 보기
              skipMenu();
            }
            setIsHeightChanged(true);
          }}
        >
          <i className={showMap ? "fa-solid fa-arrows-rotate" : "fa-solid fa-arrow-rotate-right"}></i>
          {showMap ? "처음부터 추천 받기" : "다음 메뉴 보기"}
        </ActionButton>
      </ButtonContainer>
    </RecommendationContainer>
  );
};

export default FoodRecommendation; 