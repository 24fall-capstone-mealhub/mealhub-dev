import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// 기본 레이아웃 컴포넌트
export const Container = styled(motion.div)`
  padding: 0 20px;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
`;

export const Page = styled(motion.div)`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
  padding-bottom: 30px;
`;

// 버튼 컴포넌트
export const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 16px;
  background: var(--primary-color);
  color: white;
  box-shadow: var(--box-shadow-md);
  transition: var(--transition-normal);
  
  &:hover:not(:disabled) {
    background: var(--primary-dark);
    box-shadow: var(--box-shadow-lg);
    transform: translateY(-2px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #ddd;
    color: #999;
    box-shadow: none;
  }
`;

export const SecondaryButton = styled(Button)`
  background: var(--secondary-color);
  
  &:hover:not(:disabled) {
    background: var(--secondary-dark);
  }
`;

export const OutlineButton = styled(Button)`
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  
  &:hover:not(:disabled) {
    background: rgba(255, 122, 0, 0.1);
  }
`;

// 카드 컴포넌트
export const Card = styled(motion.div)`
  background: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--box-shadow-sm);
  padding: 20px;
  margin-bottom: 16px;
  transition: var(--transition-normal);
  
  &:hover {
    box-shadow: var(--box-shadow-md);
  }
`;

// 입력 필드 컴포넌트
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-secondary);
`;

export const Input = styled.input`
  padding: 14px 16px;
  border-radius: var(--border-radius-sm);
  border: 1px solid #ddd;
  font-size: 16px;
  transition: var(--transition-fast);
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.1);
    outline: none;
  }
`;

// 로딩 애니메이션
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 4px solid rgba(255, 122, 0, 0.1);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: ${spin} 1s ease-in-out infinite;
`;

// 아이콘 컨테이너
export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: 50%;
  background: ${props => props.background || 'rgba(255, 122, 0, 0.1)'};
  color: ${props => props.color || 'var(--primary-color)'};
  transition: var(--transition-normal);
  
  i {
    font-size: ${props => props.iconSize || '18px'};
  }
`;

// 애니메이션 효과
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

export const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// 텍스트 스타일
export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
`;

export const Subtitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
`;

export const Text = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 16px;
`;

// 그리드 레이아웃
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  width: 100%;
`;

// 플렉스 레이아웃
export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || '16px'};
  width: 100%;
  flex-wrap: ${props => props.wrap || 'nowrap'};
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.align || 'flex-start'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || '16px'};
  width: 100%;
`;

// 배지
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => 
    props.variant === 'primary' ? 'var(--primary-color)' :
    props.variant === 'secondary' ? 'var(--secondary-color)' :
    props.variant === 'success' ? 'var(--success)' :
    props.variant === 'error' ? 'var(--error)' :
    props.variant === 'warning' ? 'var(--warning)' :
    'var(--primary-light)'
  };
  color: white;
`;

// 구분선
export const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 16px 0;
  width: 100%;
`;

// 이미지 컨테이너
export const ImageContainer = styled(motion.div)`
  width: 100%;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  position: relative;
  box-shadow: var(--box-shadow-sm);
  
  &:before {
    content: '';
    display: block;
    padding-top: ${props => props.aspectRatio || '75%'};
  }
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

// 부유 액션 버튼
export const FloatingActionButton = styled(motion.button)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--box-shadow-lg);
  transition: var(--transition-normal);
  z-index: 100;
  
  i {
    font-size: 24px;
  }
  
  &:hover {
    background: var(--primary-dark);
    transform: translateY(-4px);
  }
`;

// 메시지 알림
export const Toast = styled(motion.div)`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  background: ${props => 
    props.type === 'success' ? 'var(--success)' :
    props.type === 'error' ? 'var(--error)' :
    props.type === 'warning' ? 'var(--warning)' :
    'var(--primary-color)'
  };
  color: white;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--box-shadow-md);
  font-weight: 500;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 헤더
export const Header = styled(motion.header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: var(--primary-color);
  color: white;
  position: relative;
  z-index: 10;
  box-shadow: var(--box-shadow-sm);
`;

export const HeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
`; 