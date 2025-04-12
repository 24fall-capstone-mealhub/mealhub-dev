import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import useLogin from "../hooks/useLogin";

function Login() {
  const navigate = useNavigate();

  const { login, loading, err } = useLogin();
  const [formData, setFormData] = useState({id: "", pwd: ""});
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 유효성 검사
    let validationError = "";

    if (!formData.id) {
        validationError = "아이디를 입력해주세요.";
    }

    else if (!formData.pwd) {
        validationError = "비밀번호를 입력해주세요.";
    }

    if (Object.keys(validationError).length > 0) {
        setError(validationError); // 에러 메시지 설정
        return; // 에러가 있으면 제출하지 않음
    }

    // const user = await login(formData.id, formData.pwd);

    // if (loading) {
    //   alert("로딩중입니다.");
    // }
    // if (user) {
    //   localStorage.setItem("user", JSON.stringify(user));
    //   console.log(localStorage.getItem("user"));
    //   alert("로그인 성공");
    //   navigate("/");
    // }
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
        <h2>로그인</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ID</label>
            <input type="text" name="id" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input type="password" name="pwd" onChange={handleChange} />
          </div>
            <button className="submit" type="submit">로그인</button>
            <a onClick={() => navigate("/signup1")}>계정이 없으시다면? 회원가입</a>
        </form>
    </div>
  );
}

export default Login;
