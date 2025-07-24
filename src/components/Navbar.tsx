// src/components/Navbar.tsx
import React, { useEffect, useRef, useState } from "react";
import "./css/Navbar.css";
import { getCookie } from "../action";
const apiUrl = import.meta.env.VITE_API;

interface NavbarProps {
  onToggle: () => void;
}

interface User{
     id : number
     name : string
     username :string
     password : string | any
     email : string
     phoneNumber : string
     allowedTopicIds : string[ ] 
     companyId :number
     role : string
     token : string
}

const Navbar: React.FC<NavbarProps> = ({ onToggle }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [profile , setProfile ] = useState<User|any>(null)


  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect ไปหน้า login
  };

  // ปิด popup เมื่อคลิกข้างนอก
  useEffect(() => {
    const getProfile=async()=>{ 
          const userinfo = await getCookie("user_info")
          setProfile(userinfo)
          console.log("userinfo ",userinfo)
    }
    getProfile()
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <nav className="navbar">
      <button className="hamburger" onClick={onToggle}>
        ☰
      </button>
      
      <div className="logo-center">
        <div className="inner  "  >  
            <img src={apiUrl+"/api/file/drive-image/1X0TewqnVRYQxzyYePXcwHucbYv0WbCSV"}  alt="Logo" className="logo"  />
        </div>

        {/* <img src="https://drive.google.com/file/d/1V7cohT2pkNy1vwfROYU0qldmDqwv0KDW/preview" alt="Logo" className="logo" /> */}
      </div>

      <div className="profile-wrapper" ref={menuRef}>
        <div className="profile-circle set-center" onClick={() => setShowMenu(!showMenu)}>
          <img src="../icons/ionicons/person.svg" alt="person" />
        </div>
        {showMenu && (
          <div className="profile-menu">
            <p className="text-left">สวัสดี,  {profile?.name} </p>
            <ul className="text-left text-smaller" style={{listStyle:"none" , width:"100%", padding:"0"}}>
              <li>อีเมลล์&nbsp;: &nbsp;&nbsp;{profile?.email} </li>
              <li>หมายเลขโทรศัพท์ &nbsp;: &nbsp;&nbsp;{profile?.phoneNumber}</li>
            </ul>
            <button onClick={handleLogout}>ออกจากระบบ</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
