
// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import "./css/Sidebar.css";


// mock user info
const currentUser = {
  role: "admin", // หรือ "admin"
  allowedTopicIds: ["dashboard", "trash", "road" ,"water","heat","animals","maintenance", "trees", "clean"], // เฉพาะเรื่องร้องทุกข์
};

// mock fetch
const fetchSidebarData = async () => {
  // สมมุติว่าเรียกจาก API จริง
  return Promise.resolve([
    {
      id: "group1",
      title: "ภาพรวม",
      gradient: true,
      roles: ["admin", "user"],
      children: [
        { id: "dashboard", label: "แดชบอร์ด", roles: ["admin", "user"] },
      ],
    },
    {
      id: "group2",
      title: "รายชื่อสมาชิก",
      gradient: true,
      roles: ["admin", "user"],
      children: [
        { id: "moo1", label: "หมู่ 1", roles: ["admin", "user"] },
        { id: "moo2", label: "หมู่ 2", roles: ["admin", "user"] },
      ],
    },
    {
      id: "group3",
      title: "เรื่องร้องทุกข์",
      gradient: true,
      roles: ["admin", "user"],
      children: [
        { id: "road", label: "ถนน", roles: ["admin", "user"] },
        { id: "water", label: "ประปา", roles: ["admin", "user"] },
        { id: "trash", label: "ขยะ", roles: ["admin", "user", "user"] },
        { id: "heat", label: "เหตุเดือดร้อน / รำคาญ", roles: ["admin", "user"] }, 
        { id: "animals", label: "สัตว์จรจัด", roles: ["admin", "user"] },
        { id: "maintenance", label: "ซ่อมแซม", roles: ["admin", "user"] }, 
        { id: "trees", label: "ตัดต้นไม้", roles: ["admin", "user"] },
        { id: "clean", label: "ทำความสะอสด", roles: ["admin", "user"] },
      ],
    }, 
    {
      id: "group4",
      title: "งานกิจกรรม",
      gradient: true,
      roles: ["admin", "user"],
      children: [
        { id: "addevent", label: "เพิ่มกิจกรรม", roles: ["admin", "user"] },
        { id: "allevents", label: "กิจกรรมทั้งหมด", roles: ["admin", "user"] }, 
      ],
    },
  ]);
};

const Sidebar: React.FC = () => {
  const [menuData, setMenuData] = useState<any[]>([]);

  useEffect(() => {
    fetchSidebarData().then((data) => {
      // filter กลุ่มที่ user มีสิทธิ์
      const filtered = data
        .filter((group) => group.roles.includes(currentUser.role))
        .map((group) => ({
          ...group,
          children: group.children.filter(
            (item: any) =>
              item.roles.includes(currentUser.role) &&
              (group.id === "group3"
                ? currentUser.allowedTopicIds.includes(item.id)
                : true)
          ),
        }))
        .filter((group) => group.children.length > 0);
      setMenuData(filtered);
    });
  }, []);

  return (
    <aside className="sidebar">
      {menuData.map((group) => (
        <div key={group.id} className="menu-group">
          <div
            className={`menu-title ${group.gradient ? "gradient-bg" : ""}`}
          >
            {group.title}
          </div>
          <ul className="submenu">
            {group.children.map((item: any) => (
              <li key={item.id}>{item.label}</li>
            ))}
          </ul>
        </div>
      ))}
       <div  className="menu-group">
          <div
            className={`menu-title  second-gradient `}
          >
             ตั้งค่า
          </div>
        </div>
    </aside>
  );
};
export default Sidebar;


// Mock API response
const sidebarData = [
  {
    id: "group1",
    title: "ภาพรวม",
    type: "group",
    gradient: true,
    roles: ["admin", "user"],
    children: [
      { id: "dashboard", label: "แดชบอร์ด", roles: ["admin", "user"] },
    ],
  },
  {
    id: "group2",
    title: "รายชื่อสมาชิก",
    gradient: true,
    roles: ["admin"],
    children: [
      { id: "moo1", label: "หมู่ 1", roles: ["admin"] },
      { id: "moo2", label: "หมู่ 2", roles: ["admin"] },
    ],
  },
  {
    id: "group3",
    title: "เรื่องร้องทุกข์",
    gradient: true,
    roles: ["admin", "user"],
    children: [
      { id: "road", label: "ถนน", roles: ["user", "admin"] },
      { id: "water", label: "ประปา", roles: ["admin"] },
      { id: "trash", label: "ขยะ", roles: ["admin", "user"] },
    ],
  }, 
    {
      id: "group4",
      title: "งานกิจกรรม",
      gradient: true,
      roles: ["admin", "user"],
      children: [
        { id: "addevent", label: "เพิ่มกิจกรรม", roles: ["admin", "user"] },
        { id: "allevents", label: "กิจกรรมทั้งหมด", roles: ["admin", "user"] }, 
      ],
    },
];
