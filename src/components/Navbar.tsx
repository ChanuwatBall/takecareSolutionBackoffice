// src/components/Navbar.tsx
import React, { useEffect, useRef, useState } from "react";
import "./css/Navbar.css";

interface NavbarProps {
  onToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggle }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);


  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect ไปหน้า login
  };

  // ปิด popup เมื่อคลิกข้างนอก
  useEffect(() => {
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
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>

      <div className="profile-wrapper" ref={menuRef}>
        <div className="profile-circle" onClick={() => setShowMenu(!showMenu)}></div>
        {showMenu && (
          <div className="profile-menu">
            <p>สวัสดี, ผู้ใช้</p>
            <button onClick={handleLogout}>ออกจากระบบ</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
