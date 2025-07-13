// components/LoadingOverlay.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
// import '../index.css'; // 스타일 따로 관리

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const LoadingWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 9999;
  backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.3s ease;
`;

const LoadingContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--primary-color);
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled(motion.p)`
  color: white;
  font-size: 18px;
  font-weight: 500;
  margin-top: 24px;
  text-align: center;
  animation: ${pulse} 1.5s ease infinite;
`;

const FoodIcon = styled(motion.div)`
  font-size: 28px;
  color: var(--primary-color);
  margin-bottom: 16px;
  
  i {
    animation: ${pulse} 1.5s ease infinite;
  }
`;

// 현재 URL 경로에 따라 적절한 로딩 메시지를 반환하는 함수
const getLoadingMessageByPath = (pathname, defaultMessage = '메뉴를 추천하는 중...') => {
  if (pathname.includes('/login')) {
    return '로그인 중...';
  } else if (pathname.includes('/signup')) {
    return '회원가입 처리 중...';
  }
  // 홈 페이지 또는 다른 경로의 경우 기본 메시지 사용
  return defaultMessage;
};

const LoadingOverlay = ({ message }) => {
  // 현재 경로 확인
  const pathname = window.location.pathname;
  // 제공된 메시지가 있으면 사용하고, 없으면 경로에 따라 자동 선택
  const displayMessage = message || getLoadingMessageByPath(pathname);

  return ReactDOM.createPortal(
    <LoadingWrapper 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LoadingContent
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
      >
        <FoodIcon
          animate={{ 
            rotate: [0, 10, 0, -10, 0],
            transition: { repeat: Infinity, duration: 2 }
          }}
        >
          <i className="fa-solid fa-utensils" />
        </FoodIcon>
        <Spinner />
        <LoadingText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {displayMessage}
        </LoadingText>
      </LoadingContent>
    </LoadingWrapper>,
    document.body
  );
};

export default LoadingOverlay;
