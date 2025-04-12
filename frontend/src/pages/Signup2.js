import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

function Signup2() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sex: "",
    age1: "",
    age2: "",
    allergy: [],
    category: []
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
      
    if (type === "radio") {
      // 라디오 버튼의 경우, 해당 값을 formData에 저장
      setFormData({ ...formData, [name]: value });
    }
    else if (type === "checkbox") {
      // 체크박스의 경우, 체크되면 값 추가, 해제되면 값 제거
      setFormData(prevData => {
        const updatedData = { ...prevData };
        if (name === "allergy" || name === "category") {
          if (checked) {
            updatedData[name] = [...updatedData[name], value]; // 체크 시 값 추가
          } else {
            updatedData[name] = updatedData[name].filter(item => item !== value); // 체크 해제 시 값 제거
          }
        }
        return updatedData;
      });
    } else {
      // 일반 입력 값
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // 유효성 검사
    let validationError = "";

    if (!formData.sex) {
      validationError = "성별을 선택해주세요.";
    }

    else if (!formData.age1 || !formData.age2) {
      validationError = "나이대를 선택해주세요.";
    }

    else if (!formData.category) {
      validationError = "선호 카테고리를 적어도 1개 이상 선택해주세요.";
    }

    if (validationError) {
        setError(validationError); // 에러 메시지 설정
        return; // 에러가 있으면 제출하지 않음
    }
    navigate("/");
  };

  useEffect(() => {
    if(error !== null){
      alert(error);
    }
    setError(null);
  }, [error]);

  return (
    <div className="App Login">
        <div className="orange-nav">
        <h3>MEALHUB</h3>
        </div>
        <h2>회원가입</h2>
        <form className="login-form signup2" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>성별</label>
                    <div className="input-group">
                    <label><input type="radio" className="check" name="sex" value="남성" onChange={handleChange} />남성</label>
                    <label><input type="radio" className="check" name="sex" value="여성" onChange={handleChange} />여성</label>
                    </div>
            </div>
            <div className="form-group">
                <label>나이대</label>
                <div className="input-group">
                <input type="text" className="age1" name="age1" list="age1" onChange={handleChange} />
                <input type="text" className="age2" name="age2" list="age2" onChange={handleChange}></input>
                
                <datalist id="age1">
                  <option value="10대" />
                  <option value="20대" />
                  <option value="30대" />
                  <option value="40대" />
                  <option value="50대" />
                  <option value="60대" />
                  <option value="70대" />
                  <option value="80대" />
                  <option value="90대" />
                </datalist>
                <datalist id="age2">
                  <option value="초반" />
                  <option value="중반" />
                  <option value="후반" />
                </datalist>
                </div>
            </div>
            <div className="form-group">
                <label>알레르기</label>
                    <div className="input-group">
                    <label><input type="checkbox" className="check" name="allergy" value="난류" onChange={handleChange} />난류</label>
                    <label><input type="checkbox" className="check" name="allergy" value="우유" onChange={handleChange} />우유</label>
                    <label><input type="checkbox" className="check" name="allergy" value="땅콩" onChange={handleChange} />땅콩</label>
                    </div>
            </div>
            <div className="form-group category">
                <label>선호<br/>카테고리</label>
                <div className="br">
                    <div className="input-group sub">
                    <label><input type="checkbox" className="check" name="category" value="한식" onChange={handleChange} />한식</label>
                    <label><input type="checkbox" className="check" name="category" value="중식" onChange={handleChange} />중식</label>
                    <label><input type="checkbox" className="check" name="category" value="일식" onChange={handleChange} />일식</label>
                    </div>
                    <div className="input-group sub">
                    <label><input type="checkbox" className="check" name="category" value="양식" onChange={handleChange} />양식</label>
                    <label><input type="checkbox" className="check" name="category" value="동남아" onChange={handleChange} />동남아</label>
                    <label><input type="checkbox" className="check" name="category" value="분식" onChange={handleChange} />분식</label>
                    </div>
                </div>
            </div>
            <button className="submit" type="submit">가입</button>
            <a onClick={() => navigate("/login")}>계정이 있으시다면? 로그인</a>
        </form>
    </div>
  );
}

export default Signup2;
