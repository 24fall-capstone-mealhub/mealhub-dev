import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { initGuest } from '../api/guest';

// 스타일 컴포넌트
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled(motion.div)`
  background-color: white;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 16px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.2);
  padding: 24px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background: var(--primary-color);
    border-radius: 2px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
  
  &:hover {
    color: var(--primary-color);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 16px;
  
  input {
    accent-color: var(--primary-color);
    width: 18px;
    height: 18px;
  }
`;

const SelectGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Select = styled.select`
  padding: 14px 16px;
  border-radius: var(--border-radius-sm);
  border: 1px solid #ddd;
  font-size: 16px;
  flex: 1;
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.1);
    outline: none;
  }
`;

const AllergyGroup = styled.div`
  margin-top: 8px;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.6);
`;

const AllergyTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 12px;
  color: var(--text-secondary);
`;

const CheckboxRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
  
  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const CheckboxLabel = styled(motion.label)`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 15px;
  padding: 8px 12px;
  border-radius: 30px;
  transition: all 0.3s ease;
  background-color: ${props => props.checked ? 'rgba(255, 122, 0, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.checked ? 'var(--primary-color)' : '#eee'};
  
  input {
    accent-color: var(--primary-color);
    width: 18px;
    height: 18px;
  }
`;

const FoodInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const Input = styled.input`
  padding: 14px 16px;
  border-radius: var(--border-radius-sm);
  border: 1px solid #ddd;
  font-size: 16px;
  flex: 1;
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.1);
    outline: none;
  }
`;

const AddButton = styled.button`
  height: 48px;
  padding: 0 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: var(--primary-dark);
  }
`;

const FoodList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const FoodItem = styled(motion.div)`
  padding: 8px 16px;
  background: var(--primary-light);
  color: var(--primary-color);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const DeleteIcon = styled.span`
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const SubmitButton = styled(motion.button)`
  margin-top: 20px;
  width: 100%;
  height: 52px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 122, 0, 0.2);
  
  &:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 122, 0, 0.25);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const InfoText = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 10px;
  text-align: center;
`;

// 알레르기 옵션 데이터
const allergyOptions = [
  { id: 'dairy', label: '유제품' },
  { id: 'eggs', label: '계란' },
  { id: 'nuts', label: '견과류' },
  { id: 'seafood', label: '갑각류' },
  { id: 'soy', label: '대두' },
  { id: 'wheat', label: '밀' },
  { id: 'pepper', label: '고추' }
];

// 애니메이션 변수
const modalVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const containerVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const checkboxVariants = {
  checked: { 
    backgroundColor: 'rgba(255, 122, 0, 0.1)',
    borderColor: 'var(--primary-color)',
    scale: 1.05,
    transition: { type: "spring", stiffness: 500, damping: 30 }
  },
  unchecked: { 
    backgroundColor: 'transparent',
    borderColor: '#eee',
    scale: 1,
    transition: { duration: 0.2 }
  }
};

const GuestInfoModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    sex: "",
    age1: "",
    age2: "",
    allergies: []
  });
  
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
      
    if (type === "radio") {
      // 라디오 버튼의 경우, 해당 값을 formData에 저장
      setFormData({ ...formData, [name]: value });
    }
    else if (type === "checkbox") {
      // 알레르기 체크박스 처리
      if (e.target.name === 'allergyOption') {
        const allergyValue = e.target.value;
        setFormData(prevData => {
          // 현재 allergies 배열에서 해당 알레르기 존재 여부 확인
          const currentAllergies = [...prevData.allergies];
          
          if (checked) {
            // 체크된 경우 추가 (중복 방지)
            if (!currentAllergies.includes(allergyValue)) {
              currentAllergies.push(allergyValue);
            }
          } else {
            // 체크 해제된 경우 제거
            const index = currentAllergies.indexOf(allergyValue);
            if (index !== -1) {
              currentAllergies.splice(index, 1);
            }
          }
          
          return {
            ...prevData,
            allergies: currentAllergies
          };
        });
      }
    } else {
      // 일반 입력 값
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.sex) {
      setError("성별을 선택해주세요.");
      return;
    }
    if (!formData.age1 || !formData.age2) {
      setError("나이대를 선택해주세요.");
      return;
    }
    
    // 게스트 정보 구성
    const guestData = {
      age: `${formData.age1}${formData.age2}`,
      gender: formData.sex,
      dairy_allergy: formData.allergies.includes('유제품'),
      eggs_allergy: formData.allergies.includes('계란'),
      nuts_allergy: formData.allergies.includes('견과류'),
      seafood_allergy: formData.allergies.includes('갑각류'),
      soy_allergy: formData.allergies.includes('대두'),
      wheat_allergy: formData.allergies.includes('밀'),
      pepper_allergy: formData.allergies.includes('고추'),
    };
    
    // 게스트 초기화 API 호출
    initGuest(guestData)
      .then(response => {
        console.log("게스트 초기화 완료:", response);
        // 부모 컴포넌트로 데이터 전달
        onSubmit(response);
      })
      .catch(error => {
        console.error("게스트 초기화 실패:", error);
        // API 호출 실패해도 로컬에 저장하고 진행
        // onSubmit(guestData);
      });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <ModalContainer
            variants={containerVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>맞춤 추천을 위한 정보</ModalTitle>
              <CloseButton onClick={onClose}>&times;</CloseButton>
            </ModalHeader>
            
            <InfoText>더 정확한 음식 추천을 위해 정보를 입력해주세요. (선택사항)</InfoText>
            
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Label>성별</Label>
                <RadioGroup>
                  <RadioLabel>
                    <input 
                      type="radio" 
                      name="sex" 
                      value="남성" 
                      checked={formData.sex === "남성"}
                      onChange={handleChange} 
                    />
                    남성
                  </RadioLabel>
                  <RadioLabel>
                    <input 
                      type="radio" 
                      name="sex" 
                      value="여성" 
                      checked={formData.sex === "여성"}
                      onChange={handleChange} 
                    />
                    여성
                  </RadioLabel>
                </RadioGroup>
              </InputGroup>
              
              <InputGroup>
                <Label>나이대</Label>
                <SelectGroup>
                  <Select 
                    name="age1" 
                    value={formData.age1} 
                    onChange={handleChange}
                  >
                    <option value="" disabled>선택</option>
                    <option value="10대">10대</option>
                    <option value="20대">20대</option>
                    <option value="30대">30대</option>
                    <option value="40대">40대</option>
                    <option value="50대">50대</option>
                    <option value="60대">60대</option>
                    <option value="70대">70대</option>
                    <option value="80대">80대</option>
                    <option value="90대">90대</option>
                  </Select>

                  <Select 
                    name="age2" 
                    value={formData.age2} 
                    onChange={handleChange}
                  >
                    <option value="" disabled>선택</option>
                    <option value="초반">초반</option>
                    <option value="중반">중반</option>
                    <option value="후반">후반</option>
                  </Select>
                </SelectGroup>
              </InputGroup>
              
              <InputGroup>
                <Label>알레르기</Label>
                <AllergyGroup>
                  <AllergyTitle>알레르기가 있는 항목을 모두 선택해주세요</AllergyTitle>
                  <CheckboxRow>
                    {allergyOptions.slice(0, 3).map((option) => (
                      <CheckboxLabel 
                        key={option.id} 
                        checked={formData.allergies.includes(option.label)}
                        animate={formData.allergies.includes(option.label) ? "checked" : "unchecked"}
                        variants={checkboxVariants}
                      >
                        <input 
                          type="checkbox" 
                          name="allergyOption" 
                          value={option.label} 
                          checked={formData.allergies.includes(option.label)}
                          onChange={handleChange} 
                        />
                        {option.label}
                      </CheckboxLabel>
                    ))}
                  </CheckboxRow>
                  <CheckboxRow>
                    {allergyOptions.slice(3, 6).map((option) => (
                      <CheckboxLabel 
                        key={option.id} 
                        checked={formData.allergies.includes(option.label)}
                        animate={formData.allergies.includes(option.label) ? "checked" : "unchecked"}
                        variants={checkboxVariants}
                      >
                        <input 
                          type="checkbox" 
                          name="allergyOption" 
                          value={option.label} 
                          checked={formData.allergies.includes(option.label)}
                          onChange={handleChange} 
                        />
                        {option.label}
                      </CheckboxLabel>
                    ))}
                  </CheckboxRow>
                  <CheckboxRow>
                    {allergyOptions.slice(6).map((option) => (
                      <CheckboxLabel 
                        key={option.id} 
                        checked={formData.allergies.includes(option.label)}
                        animate={formData.allergies.includes(option.label) ? "checked" : "unchecked"}
                        variants={checkboxVariants}
                      >
                        <input 
                          type="checkbox" 
                          name="allergyOption" 
                          value={option.label} 
                          checked={formData.allergies.includes(option.label)}
                          onChange={handleChange} 
                        />
                        {option.label}
                      </CheckboxLabel>
                    ))}
                  </CheckboxRow>
                </AllergyGroup>
              </InputGroup>
              
              {error && <div style={{ color: 'var(--error)', fontSize: '14px' }}>{error}</div>}
              
              <SubmitButton 
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                정보 입력하기
              </SubmitButton>
            </Form>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default GuestInfoModal; 