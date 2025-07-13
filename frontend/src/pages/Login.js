import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import LoadingOverlay from "../components/LoadingOverlay";
import Header from "../components/Header";
import useUserInfo from "../hooks/useUserInfo";
import { 
  Button, 
  InputGroup, 
  Label, 
  Input, 
  Page, 
  Container, 
  Title,
  Text
} from '../styles/CommonComponents';

// 로그인 페이지 스타일
const LoginContainer = styled(Page)`
  padding: 0;
`;

const ContentContainer = styled(Container)`
  padding: 40px 20px;
`;

const LoginForm = styled(motion.form)`
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

const SignupLink = styled(motion.a)`
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

function Login() {
  const navigate = useNavigate();
  const { refreshUserInfo } = useUserInfo();

  const [formData, setFormData] = useState({id: "", pwd: ""});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({id: "", pwd: ""});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // 입력 시 해당 필드의 에러 메시지 초기화
    setFormError({...formError, [e.target.name]: ""});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 유효성 검사
    const newErrors = {};
    
    if (!formData.id) {
      newErrors.id = "아이디를 입력해주세요.";
    }

    if (!formData.pwd) {
      newErrors.pwd = "비밀번호를 입력해주세요.";
    }

    if (Object.values(newErrors).some(error => error)) {
      setFormError(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://mealhub.duckdns.org/backend/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: formData.id,
          password: formData.pwd,
        }),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
        else throw new Error("서버 응답이 실패했습니다.");
      } else {
        const token = await response.text();
        localStorage.setItem("loginId", formData.id);
        localStorage.setItem("token", token);
        
        // 로그인 성공 시 사용자 정보 즉시 갱신
        await refreshUserInfo();
        
        navigate("/");
      }
    } catch (error) {
      console.error("로그인 요청 중 에러 발생 : ", error);
      setError("로그인 요청 중 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(error !== null){
      alert(error);
    }
    setError(null);
  }, [error]);
  
  return (
    <LoginContainer>
      {loading && <LoadingOverlay message={loading === true ? "로그인 중..." : loading} />}
      <Header />
      
      <ContentContainer
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <FormTitle variants={itemVariants}>로그인</FormTitle>
        
        <LoginForm 
          onSubmit={handleSubmit}
          variants={containerVariants}
        >
          <InputGroup as={motion.div} variants={itemVariants}>
            <Label>아이디</Label>
            <Input 
              type="text" 
              name="id" 
              value={formData.id}
              onChange={handleChange} 
              placeholder="아이디를 입력하세요"
            />
            {formError.id && <ErrorMessage>{formError.id}</ErrorMessage>}
          </InputGroup>
          
          <InputGroup as={motion.div} variants={itemVariants}>
            <Label>비밀번호</Label>
            <Input 
              type="password" 
              name="pwd" 
              value={formData.pwd}
              onChange={handleChange} 
              placeholder="비밀번호를 입력하세요"
            />
            {formError.pwd && <ErrorMessage>{formError.pwd}</ErrorMessage>}
          </InputGroup>
          
          <SubmitButton 
            as={motion.button}
            type="submit"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            로그인
          </SubmitButton>
          
          <SignupLink 
            onClick={() => navigate("/signup1")}
            variants={itemVariants}
            whileHover={{ color: 'var(--primary-color)' }}
          >
            계정이 없으시다면? 회원가입
          </SignupLink>
        </LoginForm>
      </ContentContainer>
    </LoginContainer>
  );
}

export default Login;
