import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import useUserInfo from '../hooks/useUserInfo';

const HeaderContainer = styled(motion.header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  color: var(--text-primary);
  position: relative;
  z-index: 10;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  width: 100%;
`;

const Logo = styled(motion.h1)`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  cursor: pointer;
  letter-spacing: 1px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const IconButton = styled(motion.button)`
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 20px;
  padding: 8px;
  cursor: pointer;
  position: relative;
  
  &::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    opacity: 0;
    visibility: hidden;
    transition: 0.3s ease;
    white-space: nowrap;
    z-index: 1000;
  }
  
  &:hover::after {
    opacity: 1;
    visibility: visible;
  }
  
  &.active {
    color: var(--primary-color);
  }
`;

const MenuContainer = styled(motion.div)`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 220px;
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
  overflow: hidden;
  border-radius: var(--border-radius-md);
  
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 10px;
    width: 12px;
    height: 12px;
    background: white;
    transform: rotate(45deg);
    box-shadow: -2px -2px 5px rgba(0,0,0,0.04);
  }
`;

const MenuItem = styled(motion.div)`
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-primary);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(var(--primary-color-rgb), 0.05);
    transform: translateX(4px);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  i {
    color: var(--primary-color);
    font-size: 18px;
    width: 24px;
    text-align: center;
  }
`;

// 애니메이션 변수
const menuVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: 'easeIn'
    }
  }
};

const menuItemVariants = {
  hidden: { opacity: 0, x: 10 },
  visible: i => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2
    }
  }),
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.1
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.1,
    color: 'var(--primary-color)',
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.9 }
};

const Header = ({ resetHome, showPartyButton = true }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const loginId = localStorage.getItem("loginId");
  const { refreshUserInfo } = useUserInfo();
  const menuRef = useRef(null);
  const userBtnRef = useRef(null);
  
  // 바깥 클릭시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && 
          menuRef.current && 
          !menuRef.current.contains(event.target) &&
          userBtnRef.current && 
          !userBtnRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // 파티 관련 기능 추가
  const toggleParty = () => {
    // 로그인 상태 확인
    if (loginId) {
      // 로그인 상태일 경우에만 파티 기능 활성화
      const event = new CustomEvent('toggleParty');
      window.dispatchEvent(event);
    } else {
      // 비로그인 상태일 경우 알림 표시
      alert('함께 먹기 기능은 로그인 후 이용 가능합니다.');
      
      // 로그인 페이지로 이동 (선택 사항, 필요에 따라 주석 해제)
      // navigate('/login');
    }
  };
  
  // 사용자 프로필 관련 동작
  const handleUserAction = () => {
    if (loginId) {
      // 로그인 상태면 드롭다운 토글
      toggleMenu();
    } else {
      // 로그인 안 된 상태면 로그인 페이지로 이동
      navigate('/login');
    }
  };
  
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    setShowMenu(false);
  };
  
  // 로그아웃 처리 함수
  const handleLogout = async () => {
    // 캐시 및 로그인 정보 초기화
    localStorage.removeItem("loginId");
    localStorage.removeItem("token");
    
    // 사용자 정보 상태 갱신
    await refreshUserInfo();
    
    // 메뉴 닫고 로그인 페이지로 이동
    setShowMenu(false);
    navigate('/login');
  };
  
  // 로고 클릭 핸들러 수정
  const handleLogoClick = () => {
    // resetHome 함수가 전달된 경우 실행
    if (resetHome) {
      resetHome();
    }
    handleNavigation('/');
  };
  
  return (
    <>
      <HeaderContainer
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      >
        <Logo
          onClick={handleLogoClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          MEALHUB
        </Logo>
        
        <NavButtons>
          {showPartyButton && (
          <IconButton 
            data-tooltip="함께 먹기" 
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={toggleParty}
          >
            <i className="fa-solid fa-handshake"></i>
          </IconButton>
          )}
          
          <IconButton 
            ref={userBtnRef}
            className={showMenu ? "active" : ""}
            data-tooltip={loginId ? `${loginId}님` : "로그인 필요"}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleUserAction}
          >
            <i className="fa-solid fa-user"></i>
          </IconButton>
          
          <AnimatePresence>
            {showMenu && loginId && (
              <MenuContainer
                ref={menuRef}
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <MenuItem 
                  onClick={() => handleNavigation('/mypage')}
                  custom={0}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <i className="fa-solid fa-user-circle"></i>
                  <span>내 프로필</span>
                </MenuItem>
                <MenuItem 
                  onClick={handleLogout}
                  custom={1}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <i className="fa-solid fa-sign-out-alt"></i>
                  <span>로그아웃</span>
                </MenuItem>
              </MenuContainer>
            )}
          </AnimatePresence>
        </NavButtons>
      </HeaderContainer>
    </>
  );
};

export default Header; 