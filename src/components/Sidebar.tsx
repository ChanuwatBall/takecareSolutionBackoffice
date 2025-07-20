
// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import "./css/Sidebar.css";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { encodeBase64, getCookie, getMemberdetail, getSubdistrict } from "../action";
import AccordionMenu from "./AccordionMenu";


// mock user info
// const currentUser = {
//   role: "admin", // หรือ "admin"
//   allowedTopicIds: [
//     "dashboard", 
//     "trash", 
//     "road" ,
//     "water","heat","animals","maintenance", "trees", "clean"], // เฉพาะเรื่องร้องทุกข์
// };

// mock fetch
const fetchSidebarData = async () => {
  // สมมุติว่าเรียกจาก API จริง
  return Promise.resolve([ 
    // {
    //   id: "group2",
    //   title: "รายชื่อสมาชิก",
    //   gradient: true,
    //   roles: ["admin", "user"],
    //   children: [
    //     { id: "moo1", label: "หมู่ 1 ", roles: ["admin", "user"]  ,path:"/moo/moo1"},
    //     { id: "moo2", label: "หมู่ 2", roles: ["admin", "user"]  ,path:"/moo/moo2"},
    //   ],
    // },
    {
      id: "group3",
      title: "เรื่องร้องทุกข์",
      gradient: true,
      roles: ["admin", "user"],
      children: [
        { id: "road", label: "ถนน", roles: ["admin", "user"]  ,path:"/complaint/road"},
        { id: "water", label: "ประปา", roles: ["admin", "user"]  ,path:"/complaint/water"},
        { id: "trash", label: "ขยะ", roles: ["admin", "user", "user"]  ,path:"/complaint/trash"},
        { id: "heat", label: "เหตุเดือดร้อน / รำคาญ", roles: ["admin", "user"]  ,path:"/complaint/heat"}, 
        { id: "animals", label: "สัตว์จรจัด", roles: ["admin", "user"]  ,path:"/complaint/animals" },
        { id: "maintenance", label: "ซ่อมแซม", roles: ["admin", "user"]  ,path:"/complaint/maintenance"}, 
        { id: "trees", label: "ตัดต้นไม้", roles: ["admin", "user"]  ,path:"/complaint/trees"},
        { id: "clean", label: "ทำความสะอสด", roles: ["admin", "user"]  ,path:"/complaint/clean"},
      ],
    }, 
    // {
    //   id: "group4",
    //   title: "งานกิจกรรม",
    //   gradient: true,
    //   roles: ["admin", "user"],
    //   children: [
    //     { id: "addevent", label: "เพิ่มกิจกรรม", roles: ["admin", "user"]  ,path:"/addevent"},
    //     { id: "allevents", label: "กิจกรรมทั้งหมด", roles: ["admin", "user"]  ,path:"/allevents"}, 
    //   ],
    // },
  ]);
};

const Sidebar: React.FC = () => {
  const [menuData, setMenuData] = useState<any[]>([]);
  const [tumbonMooMember,setTumbonMooMember] = useState([])
  const [currentUser ,setUser] = useState( {
    role: "admin", // หรือ "admin"
    allowedTopicIds: [
      "dashboard", 
      "trash", 
      "road" ,
      "water","heat","animals","maintenance", "trees", "clean"], // เฉพาะเรื่องร้องทุกข์
  })
  const [complaintMenu ,setComplaintMenu] = useState([
        { id: "road", label: "ถนน", roles: ["admin", "user"]  ,path:"/complaint/road"},
        { id: "water", label: "ประปา", roles: ["admin", "user"]  ,path:"/complaint/water"},
        { id: "trash", label: "ขยะ", roles: ["admin", "user", "user"]  ,path:"/complaint/trash"},
        { id: "heat", label: "เหตุเดือดร้อน / รำคาญ", roles: ["admin", "user"]  ,path:"/complaint/heat"}, 
        { id: "animals", label: "สัตว์จรจัด", roles: ["admin", "user"]  ,path:"/complaint/animals" },
        { id: "maintenance", label: "ซ่อมแซม", roles: ["admin", "user"]  ,path:"/complaint/maintenance"}, 
        { id: "trees", label: "ตัดต้นไม้", roles: ["admin", "user"]  ,path:"/complaint/trees"},
        { id: "clean", label: "ทำความสะอสด", roles: ["admin", "user"]  ,path:"/complaint/clean"},
      ])
  const nav = useNavigate() 

  useEffect(() => {
    fetchSidebarData().then(async (data) => {
      const user = await getMemberdetail() //getCookie("user_info")
      console.log("user ",user)
      setUser(user)
      
      const filtered = complaintMenu.filter((menu)=> user?.allowedTopicIds.includes(menu?.id))
      console.log("filtered ",filtered)
      setComplaintMenu(filtered);
    });
    const getMoo=async()=>{
      const subdis =  await getSubdistrict()
      console.log("subdis ",subdis)
      setTumbonMooMember(subdis)
    }
    getMoo()
  }, [window.location.pathname]);

  return (
    <aside className="sidebar">
      <div   className="menu-group">
          <div
            className={`menu-title  gradient-bg `}
          >
            ภาพรวม
          </div>
          <ul className="submenu"> 
             <li   
              onClick={()=>{nav("/dashboard") }} 
              style={{ color: window.location.pathname.indexOf( "/dashboard") >-1 ? "#003592":"#535353"}}> 
               แดชบอร์ด 
              </li>
          </ul>
        </div>

         <div   className="menu-group">
          <div
            className={`menu-title  gradient-bg `}
          >
            รายชื่อสมาชิก
          </div>
         <AccordionMenu data={tumbonMooMember} select={(id:any)=>{nav("/moo/"+encodeBase64(id))}} /> 
        </div>

         <div   className="menu-group">
          <div
            className={`menu-title  gradient-bg `}
          >
            เรื่องร้องทุกข์
          </div>
          <ul className="submenu">
            {complaintMenu.map((item: any) => (
              <li key={item.id} onClick={()=>{nav(item?.path) }} style={{ color: window.location.pathname.indexOf(item?.path) >-1 ? "#003592":"#535353"}}> {item.label}</li>
            ))}
          </ul>
        </div>

        <div   className="menu-group">
          <div
            className={`menu-title  gradient-bg `}
          >
            งานกิจกรรม
          </div>
          <ul className="submenu"> 
             <li  onClick={()=>{nav("/activities") }} 
                  style={{ color: window.location.pathname.indexOf("/activities") >-1 ? "#003592":"#535353"}}> 
                กิจกรรมทั้งหมด
              </li>
              <li  onClick={()=>{nav("/activity/form") }} 
                  style={{ color: window.location.pathname.indexOf("/activity/form") >-1 ? "#003592":"#535353"}}> 
                 เพิ่มกิจกรรม
              </li>
          </ul>
        </div>

      {menuData.map((group) => (
        <div key={group.id} className="menu-group">
          <div
            className={`menu-title ${group.gradient ? "gradient-bg" : ""}`}
          >
            {group.title}
          </div>
          <ul className="submenu">
            {group.children.map((item: any) => (
              <li key={item.id} onClick={()=>{nav(item?.path) }} style={{ color: window.location.pathname.indexOf(item?.path) >-1 ? "#003592":"#535353"}}> {item.label}</li>
            ))}
          </ul>
        </div>
      ))}
       <div  className="menu-group" onClick={()=>{nav("/setting")}}>
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
      gradient: true,
      roles: ["admin", "user"],
      children: [
        { id: "dashboard", label: "แดชบอร์ด", roles: ["admin", "user"] ,path:"/dashboard"},
      ],
    },
    {
      id: "group2",
      title: "รายชื่อสมาชิก",
      gradient: true,
      roles: ["admin", "user"],
      children: [
        { id: "moo1", label: "หมู่ 1", roles: ["admin", "user"]  ,path:"/moo/moo1"},
        { id: "moo2", label: "หมู่ 2", roles: ["admin", "user"]  ,path:"/moo/moo2"},
      ],
    },
    {
      id: "group3",
      title: "เรื่องร้องทุกข์",
      gradient: true,
      roles: ["admin", "user"],
      children: [
        { id: "road", label: "ถนน", roles: ["admin", "user"]  ,path:"/complaint/road"},
        { id: "water", label: "ประปา", roles: ["admin", "user"]  ,path:"/complaint/water"},
        { id: "trash", label: "ขยะ", roles: ["admin", "user", "user"]  ,path:"/complaint/trash"},
        { id: "heat", label: "เหตุเดือดร้อน / รำคาญ", roles: ["admin", "user"]  ,path:"/complaint/heat"}, 
        { id: "animals", label: "สัตว์จรจัด", roles: ["admin", "user"]  ,path:"/complaint/animals" },
        { id: "maintenance", label: "ซ่อมแซม", roles: ["admin", "user"]  ,path:"/complaint/maintenance"}, 
        { id: "trees", label: "ตัดต้นไม้", roles: ["admin", "user"]  ,path:"/complaint/trees"},
        { id: "clean", label: "ทำความสะอสด", roles: ["admin", "user"]  ,path:"/complaint/clean"},
      ],
    }, 
    {
      id: "group4",
      title: "งานกิจกรรม",
      gradient: true,
      roles: ["admin", "user"],
      children: [
        { id: "addevent", label: "เพิ่มกิจกรรม", roles: ["admin", "user"]  ,path:"/addevent"},
        { id: "allevents", label: "กิจกรรมทั้งหมด", roles: ["admin", "user"]  ,path:"/allevents"}, 
      ],
    },
  ]