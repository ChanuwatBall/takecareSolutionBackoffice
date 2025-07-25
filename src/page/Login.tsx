import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css"; // ใช้สำหรับใส่ CSS ปุ่ม
import Alert from "../components/Alert";
import { getCookie, getDefaultCompay, login, setCookie } from "../action";
import Cookies from 'js-cookie';

const Login=()=>{
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passtype , setPassType] = useState("password") 
    const [message , setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (username && password){
            const result = await login({username , password , company: 1})
            console.log("login result ",result)


            if(result){ 
                // ✅ เก็บ token ใน cookie 1 วัน
                localStorage.setItem("token", result.token)
                setCookie('auth_token', result.token,  1 );
                setCookie('login',  {username , password} ,  7 );

                // ✅ เก็บ user info ทั้งหมด (ถ้าจำเป็น)
                setCookie('user_info',  result ,  1  );
                window.location.href = "/"
            }else{
                setMessage("Username  หรือ Password ไม่ถูกต้อง !! โปรดลองใหม่อีกครั้ง")
                setIsOpen(true)
            }
       }else{
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

    useEffect(()=>{
        const findCom=async()=>{
            const result = await getDefaultCompay()
            console.log("result ",result)
        }
        findCom()
        const checkLogin=async()=>{ 
            const token = await getCookie('auth_token');
            if(token){ 
                window.location.href = "/"
            }
            const login =  await getCookie("login");
            if(login){
                setUsername(login?.username)
                setPassword(login?.password)
            }
        }
        checkLogin()
    },[])

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
 