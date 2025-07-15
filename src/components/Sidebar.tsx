
// src/components/Sidebar.tsx
import React from "react";
import "./css/Sidebar.css";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li>ภาพรวม</li>
        <li>รายชื่อสมาชิก</li>
        <li>เรื่องร้องทุกข์</li>
        <li>งานกิจกรรม</li>
        <li>ตั้งค่า</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
