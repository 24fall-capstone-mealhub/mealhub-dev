import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import useUserInfo from '../hooks/useUserInfo';

const PartyContainer = styled(motion.div)`
  background: linear-gradient(135deg, var(--secondary-light), var(--secondary-color));
  border-radius: 0 0 var(--border-radius-md) var(--border-radius-md);
  box-shadow: var(--box-shadow-md);
  overflow: hidden;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
`;

const PartyButton = styled(motion.button)`
  flex: 1;
  height: 100%;
  padding: 0 20px;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.15)' : 'transparent'};
  color: white;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: ${props => props.active ? '0' : '50%'};
    width: ${props => props.active ? '100%' : '0'};
    height: 3px;
    background: white;
    transition: all 0.3s ease;
  }
  
  &:hover::after {
    left: 0;
    width: 100%;
  }
  
  i {
    font-size: 18px;
  }
`;

const ContentContainer = styled(motion.div)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(motion.h3)`
  color: white;
  margin-bottom: 20px;
  font-size: 20px;
  text-align: center;
`;

const InputGroup = styled.div`
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--border-radius-sm);
  border: none;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--box-shadow-sm);
  text-align: center;
  letter-spacing: 1px;
  
  &:focus {
    outline: none;
    background: white;
    box-shadow: var(--box-shadow-md);
  }
  
  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: white;
  color: var(--secondary-color);
  font-weight: 600;
  padding: 12px 30px;
  border-radius: 50px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  box-shadow: var(--box-shadow-sm);
  
  i {
    font-size: 18px;
  }
`;

const CodeDisplay = styled(motion.div)`
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: var(--border-radius-sm);
  margin: 20px 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 2px;
  color: white;
  text-align: center;
  box-shadow: var(--box-shadow-sm);
  border: 1px dashed rgba(255, 255, 255, 0.5);
`;

const Message = styled(motion.p)`
  margin-top: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  text-align: center;
`;

const InstructionBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  padding: 12px 16px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 300px;
  
  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
  }
`;

const MembersList = styled(motion.div)`
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  padding: 16px;
  width: 100%;
  max-width: 300px;
`;

const MembersTitle = styled.h4`
  color: white;
  font-size: 16px;
  margin-bottom: 12px;
  text-align: center;
`;

const MemberItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  i {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
  }
  
  span {
    color: white;
    font-size: 14px;
  }
`;

const SuccessMessage = styled(motion.div)`
  margin-top: 15px;
  padding: 10px 16px;
  background: rgba(46, 204, 113, 0.2);
  border-radius: var(--border-radius-sm);
  color: white;
  font-size: 15px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  i {
    color: #2ecc71;
  }
`;

// 애니메이션 변수
const containerVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { 
    height: 'auto', 
    opacity: 1,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.2, delay: 0.1 }
    }
  },
  exit: { 
    height: 0, 
    opacity: 0,
    transition: {
      opacity: { duration: 0.2 },
      height: { duration: 0.3, delay: 0.1 }
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

function Party({ showParty, setShowParty, code, setCode, fetchPartyCreate, fetchPartyJoin, fetchPartyMembers, fetchMyParty, leaveParty, deleteParty }) {
    const [generatedCode, setGeneratedCode] = useState("");
    const [joinSuccess, setJoinSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [partyMembers, setPartyMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [myPartyCode, setMyPartyCode] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isHost, setIsHost] = useState(false);
    
    // userInfo 가져오기
    const { userInfo, loading: userLoading } = useUserInfo();
    
    // 컴포넌트 마운트 시 내 파티 정보 조회
    useEffect(() => {
        if (showParty > 0) {
            checkMyParty();
        }
    }, [showParty]);
    
    // 내 파티 정보 조회 함수
    const checkMyParty = async () => {
        try {
            setInitialLoading(true);
            const partyCode = await fetchMyParty();
            
            if (partyCode) {
                console.log("내가 속한 파티 코드:", partyCode);
                setMyPartyCode(partyCode);
                
                // 파티 멤버 목록 조회
                if (userInfo && userInfo.id) {
                    try {
                        console.log("파티 멤버 목록 조회 시작... userId:", userInfo.id);
                        const memberIds = await fetchPartyMembers(userInfo.id);
                        console.log("받아온 멤버 목록:", memberIds);
                        
                        if (Array.isArray(memberIds) && memberIds.length > 0) {
                            setPartyMembers(memberIds);
                            
                            // 호스트 여부 확인 - 멤버 목록의 첫 번째가 자신인 경우 호스트
                            setIsHost(memberIds[0] === userInfo.id);
                            console.log("호스트 여부:", memberIds[0] === userInfo.id);
                        } else {
                            console.warn("멤버 목록이 비어있거나 배열이 아닙니다:", memberIds);
                            setPartyMembers([]);
                        }
                    } catch (error) {
                        console.error("파티 멤버 목록 가져오기 실패:", error);
                        setPartyMembers([]);
                    }
                } else {
                    console.error("사용자 ID를 찾을 수 없습니다.");
                }
                
                // 파티 화면으로 전환 (새로운 상태 4 추가)
                setShowParty(4);
            }
        } catch (error) {
            console.error("내 파티 정보 조회 실패:", error);
        } finally {
            setInitialLoading(false);
        }
    };
    
    const handleCreateParty = async () => {
        try {
            setLoading(true);
        // 파티 생성 요청 보내기
        const partyCode = await fetchPartyCreate();
            
            if (partyCode) {
                setMyPartyCode(partyCode.toUpperCase());
                setIsHost(true); // 파티 생성자는 호스트
                
                // 파티 멤버 목록 조회 - 호스트도 파티원임
                if (userInfo && userInfo.id) {
                    try {
                        console.log("파티 생성 후 멤버 목록 조회 userId:", userInfo.id);
                        const memberIds = await fetchPartyMembers(userInfo.id);
                        setPartyMembers(memberIds || []);
                    } catch (error) {
                        console.error("파티 멤버 목록 가져오기 실패:", error);
                        setPartyMembers([]);
                    }
                }
                
                // 파티 생성 후 바로 내 파티 정보 화면으로 전환
                setShowParty(4);
            } else {
                // generatedCode는 더 이상 사용하지 않음
                alert("파티 생성에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("파티 생성 오류:", error);
            alert("파티 생성에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleJoinParty = async () => {
        if (!code.trim()) {
            alert("초대코드를 입력해주세요!");
            return;
        }
        
        setLoading(true);
        
        try {
        // 파티 참가 요청 보내기
            const response = await fetchPartyJoin(code);
            console.log("파티 참가 응답:", response);
            
            // "Joined party: {code}" 형식인지 확인
            if (response && response.includes("Joined party:")) {
                // 코드 추출
                const codeMatch = response.match(/Joined party: (.+)/);
                if (codeMatch && codeMatch[1]) {
                    setMyPartyCode(codeMatch[1].trim().toUpperCase());
                }
                
                // 멤버 목록 가져오기
                if (userInfo && userInfo.id) {
                    try {
                        // 파티 멤버 목록 가져오기
                        console.log("파티 참가 후 멤버 목록 조회 userId:", userInfo.id);
                        const memberIds = await fetchPartyMembers(userInfo.id);
                        setPartyMembers(memberIds || []);
                        
                        // 호스트 여부 확인 (파티 참가자는 호스트가 아님)
                        setIsHost(false);
                    } catch (error) {
                        console.error("파티 멤버 목록 가져오기 실패:", error);
                        setPartyMembers([]);
                    }
                }
                
                // 파티 참가 성공 시 바로 내 파티 정보 화면으로 전환
                setShowParty(4);
            } else {
                alert("파티 참가에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("파티 참가 오류:", error);
            alert("파티 참가 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleLeaveParty = async () => {
        const confirmed = window.confirm("정말 파티를 나가시겠습니까?");
        if (!confirmed) return;
        
        try {
            setLoading(true);
            console.log("파티 나가기 요청 partyCode:", myPartyCode);
            
            // 파티 나가기 API 호출
            await leaveParty(myPartyCode);
            alert("파티를 나갔습니다.");
            setMyPartyCode(null);
            setPartyMembers([]);
            setShowParty(1);
        } catch (error) {
            console.error("파티 나가기 실패:", error);
            alert("파티 나가기에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };
    
    // 파티 삭제 함수 (호스트용)
    const handleDeleteParty = async () => {
        const confirmed = window.confirm("정말 파티를 삭제하시겠습니까? 모든 멤버가 파티에서 제거됩니다.");
        if (!confirmed) return;
        
        try {
            setLoading(true);
            console.log("파티 삭제 요청 partyCode:", myPartyCode);
            
            // 파티 삭제 API 호출
            await deleteParty(myPartyCode);
            alert("파티가 삭제되었습니다.");
            setMyPartyCode(null);
            setPartyMembers([]);
            setIsHost(false);
            setShowParty(1);
        } catch (error) {
            console.error("파티 삭제 실패:", error);
            alert("파티 삭제에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };
    
    // 초기 로딩 중이면 로딩 표시
    if (showParty > 0 && initialLoading) {
        return (
            <PartyContainer
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <ContentContainer
                    key="loading"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ minHeight: '200px', justifyContent: 'center' }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', color: 'white' }}></i>
                        <p style={{ color: 'white' }}>파티 정보를 불러오는 중...</p>
                    </div>
                </ContentContainer>
            </PartyContainer>
        );
    }
    
    return (
        <AnimatePresence>
            {showParty > 0 && (
                <PartyContainer
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {myPartyCode ? (
                        // 파티에 이미 속해 있는 경우
                        <ContentContainer
                            key="my-party"
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <Title>내 파티 정보</Title>
                            
                            <SuccessMessage
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <i className={isHost ? "fa-solid fa-crown" : "fa-solid fa-users"}></i>
                                <span>{isHost ? "파티 호스트입니다" : "현재 파티에 참여 중입니다"}</span>
                            </SuccessMessage>
                            
                            <CodeDisplay
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                            >
                                {myPartyCode.toUpperCase()}
                            </CodeDisplay>
                            
                            <Message
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                이 코드를 친구들에게 공유하세요!
                            </Message>
                            
                            {partyMembers.length > 0 && (
                                <MembersList
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <MembersTitle>파티 멤버 목록</MembersTitle>
                                    {partyMembers.map((memberId, index) => (
                                        <MemberItem 
                                            key={memberId}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + index * 0.1 }}
                                        >
                                            <i className={index === 0 ? "fa-solid fa-crown" : "fa-solid fa-user"}></i>
                                            <span>
                                                {index === 0 ? "호스트" : `멤버 #${index}`} (ID: {memberId})
                                                {userInfo && memberId === userInfo.id && " (나)"}
                                            </span>
                                        </MemberItem>
                                    ))}
                                    <Message
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 + partyMembers.length * 0.1 }}
                                    >
                                        총 {partyMembers.length}명의 멤버가 함께합니다
                                    </Message>
                                </MembersList>
                            )}
                            
                            {isHost ? (
                                // 호스트인 경우 파티 삭제 버튼
                                <ActionButton
                                    whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleDeleteParty}
                                    style={{ marginTop: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#e74c3c' }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                    ) : (
                                        <i className="fa-solid fa-trash-alt"></i>
                                    )}
                                    {loading ? "처리 중..." : "파티 삭제하기"}
                                </ActionButton>
                            ) : (
                                // 참가자인 경우 파티 나가기 버튼
                                <ActionButton
                                    whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLeaveParty}
                                    style={{ marginTop: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#e74c3c' }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                    ) : (
                                        <i className="fa-solid fa-sign-out-alt"></i>
                                    )}
                                    {loading ? "처리 중..." : "파티 나가기"}
                                </ActionButton>
                            )}
                        </ContentContainer>
                    ) : (
                        // 파티에 속해있지 않은 경우
                        <>
                    <ButtonContainer>
                        <PartyButton
                            active={showParty === 2}
                                    onClick={() => {
                                        setJoinSuccess(false);
                                        setPartyMembers([]);
                                        setShowParty(2);
                                    }}
                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <i className="fa-solid fa-user-plus"></i>
                            초대하기
                        </PartyButton>
                        <PartyButton
                            active={showParty === 3}
                                    onClick={() => {
                                        setJoinSuccess(false);
                                        setPartyMembers([]);
                                        setShowParty(3);
                                    }}
                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <i className="fa-solid fa-right-to-bracket"></i>
                            참가하기
                        </PartyButton>
                    </ButtonContainer>
                    
                    <AnimatePresence mode="wait">
                        {showParty === 2 && (
                            <ContentContainer
                                key="host"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <Title>친구들과 함께 먹어요!</Title>
                                <InstructionBox
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <p>파티를 만들고 친구들에게 코드를 공유하세요. 함께 추천 받은 메뉴로 맛있는 식사를 즐겨보세요!</p>
                                </InstructionBox>
                                
                                    <ActionButton
                                        whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCreateParty}
                                            disabled={loading}
                                    >
                                            {loading ? (
                                                <i className="fa-solid fa-spinner fa-spin"></i>
                                            ) : (
                                        <i className="fa-solid fa-people-group"></i>
                                            )}
                                            {loading ? "처리 중..." : "파티 만들기"}
                                    </ActionButton>
                                    </ContentContainer>
                        )}
                        
                        {showParty === 3 && (
                            <ContentContainer
                                key="join"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <Title>친구의 파티에 참가하세요!</Title>
                                        
                                <InputGroup>
                                    <Input
                                        type="text"
                                        placeholder="초대코드 입력"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        maxLength={8}
                                    />
                                </InputGroup>
                                <ActionButton
                                    whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleJoinParty}
                                            disabled={loading}
                                >
                                            {loading ? (
                                                <i className="fa-solid fa-spinner fa-spin"></i>
                                            ) : (
                                    <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                            )}
                                            {loading ? "처리 중..." : "참가하기"}
                                </ActionButton>
                            </ContentContainer>
                        )}
                    </AnimatePresence>
                        </>
                    )}
                </PartyContainer>
            )}
        </AnimatePresence>
    );
}

export default Party;