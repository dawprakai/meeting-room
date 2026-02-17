import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

import { useNavigate, Link } from "react-router-dom"; // 1. เพิ่ม Link ตรงนี้



export default function Login() {

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const navigate = useNavigate();



  const handleLogin = () => {

    login(username, password);

    if (username === "admin") navigate("/admin");

    else navigate("/user");

  };



  return (

    <div className="login-page">

      <div className="login-card">

        <h2 className="login-title">เข้าสู่ระบบจองห้อง</h2>



        <input

          className="login-input"

          placeholder="Username"

          onChange={(e) => setUsername(e.target.value)}

        />



        <input

          className="login-input"

          type="password"

          placeholder="Password"

          onChange={(e) => setPassword(e.target.value)}

        />



        <button className="login-btn" onClick={handleLogin}>

          Login

        </button>



        {/* 2. เพิ่มโค้ดส่วนนี้ต่อจากปุ่ม Login */}

        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#666' }}>

          ยังไม่มีบัญชี? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>สมัครสมาชิก</Link>

        </p>

       

      </div>

    </div>

  );

}