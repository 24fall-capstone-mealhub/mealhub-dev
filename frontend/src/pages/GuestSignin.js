import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Header from "../components/Header";
import LoadingOverlay from "../components/LoadingOverlay";
import menuData from '../menu.json';
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

const SigninContainer = styled(Page)`
  padding: 0;
`;

const ContentContainer = styled(Container)`
  padding: 40px 20px;
`;

const SigninForm = styled(motion.form)`
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

const Autocomplete = styled.div`
  position: relative;
  width: 100%;
`;

const FoodInputGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const AddButton = styled(Button)`
  height: 48px;
  padding: 0 16px;
  font-size: 14px;
  white-space: nowrap;
  background-color: var(--primary-color);
  color: white;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const DropdownContainer = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled(motion.div)`
  padding: 12px 16px;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 122, 0, 0.1);
    color: var(--primary-color);
  }
  
  &.selected {
    background: rgba(255, 122, 0, 0.1);
    color: var(--primary-color);
  }
`;

const FoodList = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const FoodItem = styled(motion.div)`
  background: rgba(255, 122, 0, 0.1);
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  border: 1px solid var(--primary-color);
  color: var(--text-primary);
`;

const DeleteIcon = styled.span`
  cursor: pointer;
  color: var(--primary-color);
  font-size: 18px;
  line-height: 1;
  
  &:hover {
    color: var(--error);
  }
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

const dropdownVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 }
  }
};

function GuestSignin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ id: "", pwd: "", checkpwd: "" });
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState({id: "", pwd: "", checkpwd: ""});
  const [loading, setLoading] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const autocompleteRef = useRef(null);
  
  // menu.json에서 메뉴 이름 목록 추출
  const menuItems = Object.keys(menuData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError({...formError, [e.target.name]: ""});
  };

  // 입력값에 따라 추천 메뉴 필터링
  const filterSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    
    if (inputValue === '') {
      setSuggestions([]);
      return;
    }
    
    const filteredItems = menuItems
      .filter(menu => menu.toLowerCase().includes(inputValue))
      .slice(0, 8);
    
    setSuggestions(filteredItems);
  };

  const handleFoodInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedIndex(-1);
    setShowDropdown(true);
    filterSuggestions(value);
  };

  const handleSelectSuggestion = (suggestion) => {
    if (foodList.includes(suggestion)) {
      alert('이미 추가된 음식입니다.');
      return;
    }
    
    setFoodList([...foodList, suggestion]);
    setInputValue('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[selectedIndex]);
    }
  };

  const handleAddFood = () => {
    if (!inputValue.trim()) return;
    
    if (foodList.includes(inputValue)) {
      alert('이미 추가된 음식입니다.');
      return;
    }
    
    if (menuItems.includes(inputValue)) {
      setFoodList([...foodList, inputValue]);
      setInputValue('');
      setSuggestions([]);
    } else {
      alert('메뉴 목록에 없는 음식입니다.');
    }
  };

  const handleRemoveFood = (index) => {
    const newList = [...foodList];
    newList.splice(index, 1);
    setFoodList(newList);
  };

  const handleSubmit = async (e) => {
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

    setLoading(true);

    try {
      const response = await fetch("https://mealhub.duckdns.org/backend/guest/signin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId: formData.id,
          password: formData.pwd,
          confirmPassword: formData.checkpwd
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const userId = responseData.userId;
        
        // 선호 음식 목록이 있는 경우 저장
        if (userId && foodList.length > 0) {
            try {
                const menuIdList = foodList.map(food => menuData[food]?.menu_id).filter(id => id);

                const initResponse = await fetch("https://mealhub.duckdns.org/api/feedback/init", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        favorite_menu_ids: menuIdList
                    }),
                });
                
                if (initResponse.ok) {
                    console.log("선호 메뉴 초기화 성공");
                } else {
                    console.error("선호 메뉴 초기화 실패");
                }
            } catch (initError) {
                console.error("선호 메뉴 초기화 중 오류 발생:", initError);
            }
        }

        alert("게스트 회원가입이 완료되었습니다!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "회원가입에 실패했습니다.");
      }
    } catch (err) {
      setError("서버와의 연결에 실패했습니다.");
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
    <SigninContainer>
      <Header />
      {loading && <LoadingOverlay message="회원가입 처리 중..." />}
      
      <ContentContainer
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <SigninForm 
          onSubmit={handleSubmit}
          variants={containerVariants}
        >
          <FormTitle variants={itemVariants}>게스트 회원가입</FormTitle>
          
          <InputGroup as={motion.div} variants={itemVariants}>
            <Label>아이디</Label>
            <Input 
              type="text" 
              name="id" 
              value={formData.id}
              onChange={handleChange} 
              placeholder="4~12자 영문, 숫자"
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

          <InputGroup as={motion.div} variants={itemVariants}>
            <Label>선호음식</Label>
            <Autocomplete ref={autocompleteRef}>
              <FoodInputGroup>
                <Input 
                  type="text" 
                  name="favorite" 
                  value={inputValue} 
                  onChange={handleFoodInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="좋아하는 음식을 입력하세요"
                  autoComplete="off"
                />
                <AddButton 
                  type="button"
                  onClick={handleAddFood}
                  as={motion.button}
                  whileHover={{ scale: 1.02, backgroundColor: 'var(--primary-dark)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  등록
                </AddButton>
              </FoodInputGroup>
              
              <AnimatePresence>
                {showDropdown && suggestions.length > 0 && (
                  <DropdownContainer
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {suggestions.map((suggestion, index) => (
                      <DropdownItem
                        key={index}
                        className={index === selectedIndex ? 'selected' : ''}
                        onClick={() => handleSelectSuggestion(suggestion)}
                        whileHover={{ x: 4 }}
                      >
                        {suggestion}
                      </DropdownItem>
                    ))}
                  </DropdownContainer>
                )}
              </AnimatePresence>
            </Autocomplete>
            
            <AnimatePresence>
              {foodList.length > 0 && (
                <FoodList>
                  {foodList.map((food, idx) => (
                    <FoodItem
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -4, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                    >
                      {food}
                      <DeleteIcon 
                        onClick={() => handleRemoveFood(idx)}
                      >
                        ×
                      </DeleteIcon>
                    </FoodItem>
                  ))}
                </FoodList>
              )}
            </AnimatePresence>
          </InputGroup>
          
          <SubmitButton 
            as={motion.button}
            type="submit"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            가입하기
          </SubmitButton>
          
          <LoginLink 
            onClick={() => navigate("/login")}
            variants={itemVariants}
            whileHover={{ color: 'var(--primary-color)' }}
          >
            계정이 있으시다면? 로그인
          </LoginLink>
        </SigninForm>
      </ContentContainer>
    </SigninContainer>
  );
}

export default GuestSignin;
