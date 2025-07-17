import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css"; // ใช้สำหรับใส่ CSS ปุ่ม
import Alert from "../components/Alert";

const Login=()=>{
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passtype , setPassType] = useState("password") 
    const [message , setMessage] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 🔐 ตรวจสอบ login แบบง่าย (mock)
        if ((username && password) && (username.match("admin") && password.match("123456"))) {
            localStorage.setItem("token", "fake-token");
            // navigate("/");
            window.location.href = "/"
        } else if ((username && password) && ( !username.match("admin") ||  !password.match("123456"))) {
            // alert("Username  หรือ Password ไม่ถูกต้อง !! โปรดลองใหม่อีกครั้ง");
            setMessage("Username  หรือ Password ไม่ถูกต้อง !! โปรดลองใหม่อีกครั้ง")
            setIsOpen(true)
        } else {
            // alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            setMessage("กรุณากรอกข้อมูลให้ครบถ้วน")
            setIsOpen(true)
        }
    };

    const viewPassword=()=>{  
        if(passtype.match("password")){
            setPassType("text")
        }else{
            setPassType("password")
        }
    }

    return(
      <div className="login-container">
      <h2>เข้าสู่ระบบ</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input"> 
            <input
            type="text"
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
        </div>
        <div className="input"> 
            <input
                type={passtype}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <div className="button clear" onClick={()=>{viewPassword()}} >  
                <img src={ passtype.match("password") ? "icons/ionicons/eye-outline.svg" : "icons/ionicons/eye-off-outline.svg"} style={{width:"1rem"}} />
            </div>
        </div>
        <button type="submit" className="gradient-button">
          เข้าสู่ระบบ
        </button>
      </form>

      <Alert
        isOpen={isOpen}
        setOpen={setIsOpen}
        title="ไม่สามารเข้าสู่ระบบ"
        message={message}
        buttons={[
            {
            text: "ยกเลิก",
            role: "cancel",
              handler: () => console.log("Cancel"),
            },
            {
            text: "ตกลง",
            role: "confirm",
              handler: () => console.log("Confirmed"),
            },
        ]}
        />
    </div>
    )
}

export default Login;