import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) return alert("กรุณากรอกข้อมูลให้ครบ");
    const result = await register(username, password);
    if (result.success) {
      alert("สมัครสมาชิกสำเร็จ!");
      navigate("/");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">สมัครสมาชิก</h2>
        <input className="login-input" placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input className="login-input" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button className="login-btn" onClick={handleRegister}>สมัครสมาชิก</button>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          มีบัญชีแล้ว? <Link to="/">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}