import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Header from "../components/Header";
import LoadingOverlay from "../components/LoadingOverlay";
import { checkGuest } from "../api/guest";
import { 
  Button, 
  InputGroup, 
  Label, 
  Input, 
  Page, 
  Container, 
  Title,
  Row
} from '../styles/CommonComponents';

// 회원가입 페이지 스타일
const SignupContainer = styled(Page)`
  padding: 0;
`;

const ContentContainer = styled(Container)`
  padding: 40px 20px;
`;

const SignupForm = styled(motion.form)`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormTitle = styled(Title)`
  margin-bottom: 30px;
  text-align: center;
`;

const SubmitButton = styled(Button)`
  margin-top: 16px;
  width: 100%;
`;

const LoginLink = styled(motion.a)`
  text-align: center;
  margin-top: 20px;
  color: var(--text-secondary);
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const ErrorMessage = styled(motion.div)`
  color: var(--error);
  font-size: 14px;
  margin-top: -12px;
  margin-bottom: -12px;
`;

const CheckButton = styled(Button)`
  height: 48px;
  padding: 0 16px;
  font-size: 14px;
  margin-left: 8px;
  white-space: nowrap;
`;

const InputWithButton = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
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

function Signup1() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ id: "", pwd: "", checkpwd: "" });
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState({id: "", pwd: "", checkpwd: ""});
  const [loading, setLoading] = useState(false);
  const [guestId, setGuestId] = useState(null);

  // 페이지 진입 시 게스트 정보 체크
  useEffect(() => {
    setLoading(true);
    checkGuest()
      .then((userId) => {
        console.log("게스트 ID:", userId);
        setGuestId(userId);
      })
      .catch((error) => {
        console.error("게스트 정보 확인 실패:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const checkGuestStatus = async () => {
      setLoading(true);
      try {
        const userId = await checkGuest();
        if (userId) {
          navigate("/guest-signin");
          return;
        }
      } catch (error) {
        console.error("게스트 체크 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    checkGuestStatus();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // 입력 시 해당 필드의 에러 메시지 초기화
    setFormError({...formError, [e.target.name]: ""});
  };

  const checkIdDuplicate = () => {
    if (!formData.id) {
      setFormError({...formError, id: "아이디를 먼저 입력해주세요."});
      return;
    }
    
    if (!formData.id.match(/^[a-zA-Z0-9]{4,12}$/)) {
      setFormError({...formError, id: "아이디는 4~12자의 영문 대소문자와 숫자로만 구성되어야 합니다."});
      return;
    }
    
    // 여기에 ID 중복 체크 API 호출 추가
    alert("사용 가능한 아이디입니다.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사
    const newErrors = {};

    if (!formData.id) {
      newErrors.id = "아이디를 입력해주세요.";
    } else if (!formData.id.match(/^[a-zA-Z0-9]{4,12}$/)) {
      newErrors.id = "아이디는 4~12자의 영문 대소문자와 숫자로만 구성되어야 합니다.";
    }

    if (!formData.pwd) {
      newErrors.pwd = "비밀번호를 입력해주세요.";
    } else if (!formData.pwd.match(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/)) {
      newErrors.pwd = "비밀번호는 8~16자 영문 대소문자와 숫자로만 구성되어야 합니다.";
    } else if (/\s/.test(formData.pwd)) {
      newErrors.pwd = "비밀번호는 공백을 포함할 수 없습니다.";
    }

    if (!formData.checkpwd) {
      newErrors.checkpwd = "비밀번호 확인을 입력해주세요.";
    } else if (formData.pwd !== formData.checkpwd) {
      newErrors.checkpwd = "비밀번호가 일치하지 않습니다.";
    }

    if (Object.values(newErrors).some(error => error)) {
      setFormError(newErrors);
      return;
    }
    
    navigate("/signup2", { state: { id: formData.id, pwd: formData.pwd }});
  };

  useEffect(() => {
    if(error !== null){
      alert(error);
    }
    setError(null); // 에러 메시지 초기화
  }, [error]);

  return (
    <SignupContainer>
      <Header />
      {loading && <LoadingOverlay message="게스트 정보 확인 중..." />}
      
      <ContentContainer
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <FormTitle variants={itemVariants}>회원가입</FormTitle>
        
        <SignupForm 
          onSubmit={handleSubmit}
          variants={containerVariants}
        >
          <InputGroup as={motion.div} variants={itemVariants}>
            <Label>아이디</Label>
            <InputWithButton>
              <Input 
                type="text" 
                name="id" 
                value={formData.id}
                onChange={handleChange} 
                placeholder="4~12자 영문, 숫자"
              />
              <CheckButton
                type="button"
                onClick={checkIdDuplicate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                중복확인
              </CheckButton>
            </InputWithButton>
            {formError.id && <ErrorMessage>{formError.id}</ErrorMessage>}
          </InputGroup>
          
          <InputGroup as={motion.div} variants={itemVariants}>
            <Label>비밀번호</Label>
            <Input 
              type="password" 
              name="pwd" 
              value={formData.pwd}
              onChange={handleChange} 
              placeholder="8~16자 영문, 숫자 조합"
            />
            {formError.pwd && <ErrorMessage>{formError.pwd}</ErrorMessage>}
          </InputGroup>
          
          <InputGroup as={motion.div} variants={itemVariants}>
            <Label>비밀번호 확인</Label>
            <Input 
              type="password" 
              name="checkpwd" 
              value={formData.checkpwd}
              onChange={handleChange} 
              placeholder="비밀번호 재입력"
            />
            {formError.checkpwd && <ErrorMessage>{formError.checkpwd}</ErrorMessage>}
          </InputGroup>
          
          <SubmitButton 
            as={motion.button}
            type="submit"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            다음
          </SubmitButton>
          
          <LoginLink 
            onClick={() => navigate("/login")}
            variants={itemVariants}
            whileHover={{ color: 'var(--primary-color)' }}
          >
            계정이 있으시다면? 로그인
          </LoginLink>
        </SignupForm>
      </ContentContainer>
    </SignupContainer>
  );
}

export default Signup1;
