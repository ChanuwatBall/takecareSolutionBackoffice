import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css"; // ใช้สำหรับใส่ CSS ปุ่ม

const Login=()=>{
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 🔐 ตรวจสอบ login แบบง่าย (mock)
        if (username && password) {
        localStorage.setItem("token", "fake-token");
        // navigate("/");
        window.location.href = "/"
        } else {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        }
    };

    return(
        <div className="login-container">
      <h2>เข้าสู่ระบบ</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="gradient-button">
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
    )
}

export default Login;