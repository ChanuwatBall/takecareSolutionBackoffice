import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


interface Member {
  id: string;
  username: string;
  phone: string;
  fullName: string;
  birthdate: string; // ISO date string
  email?: string;
  gender?: string;
}


const MooID:React.FC=()=>{
  const { id } = useParams<{ id: string }>();
  const [members, setMembers] = useState<Member[]>([
  {
    "id": "u1",
    "username": "Yah Jantalak",
    "phone": "0854737030",
    "fullName": "จันทลักขณ์ กลิ่นอุบล",
    "birthdate": "2014-01-31",
    "email": "",
    "gender": ""
  },
  {
    "id": "u2",
    "username": "66 Tar 415 🌀",
    "phone": "0642200678",
    "fullName": "ณัฐธิดา แยะแหล่ม",
    "birthdate": "2004-06-25",
    "email": "",
    "gender": ""
  }
]);
  const [search, setSearch] = useState("");
  

  useEffect(() => {
    // mock fetch from API by moo id
    fetch(`/api/moo/${id}/members`) // ใช้ API จริงแทน mock นี้
      .then((res) => res.json())
      .then(setMembers);
  }, [id]);

  const filteredMembers = members.filter((m) =>
    `${m.fullName} ${m.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  const calculateAge = (birthdate: string) => {
    const dob = new Date(birthdate);
    const now = new Date();
    return now.getFullYear() - dob.getFullYear();
  };


    return(
    <div className="moo-page" >
       <div style={{ background: "#f2f2f2", padding: "2rem", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ fontWeight: 500, marginBottom: "1rem" ,textAlign:"left"}}>
          รายชื่อสมาชิกหมู่ {id}
        </h2>

        {/* จำนวนสมาชิก Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "1.5rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            width: "fit-content",
          }}
        >
          <p style={{ fontSize: "1rem", color: "#888" }}>จำนวนสมาชิก</p>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "600", margin: 0 }}>
            {members.length.toLocaleString()}
          </h1>
        </div>

        {/* ช่องค้นหา */}
        <div
          style={{
            background: "#fff",
            padding: "1.25rem 1.5rem",
            borderRadius: "16px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            maxWidth:"30rem"
          }}
        >
          <input
            type="text"
            placeholder="ค้นหาจาก ชื่อ หรือ หมายเลขโทรศัพท์"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "1rem",
              padding: "0.5rem 0",
            }}
          />
          <span style={{ fontSize: "1.5rem", color: "#aaa" }}>🔍</span>
        </div>

        {/* ตารางสมาชิก */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ color: "#555", fontWeight: 500 , borderBottom :"1px solid #E0E0E0" }}>
              <tr>
                <th style={thStyle}>User Name</th>
                <th style={thStyle}>หมายเลขโทรศัพท์</th>
                <th style={thStyle}>ชื่อ-นามสกุล</th>
                <th style={thStyle}>วันเกิด</th>
                <th style={thStyle}>อายุ</th>
                <th style={thStyle}>อีเมลล์</th>
                <th style={thStyle}>เพศ</th>
                <th style={{...thStyle,...{  
                    borderLeft:"1px solid rgb(235, 235, 235)"  ,
                    boxShadow:" -18px -5px 15px -22px rgba(0,0,0,0.3)", 
                 }}}> </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => (
                <tr key={m.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>{m.username}</td>
                  <td style={tdStyle}>{m.phone}</td>
                  <td style={tdStyle}>{m.fullName}</td>
                  <td style={tdStyle}>
                    {new Date(m.birthdate).toLocaleDateString("th-TH")}
                  </td>
                  <td style={tdStyle}>{calculateAge(m.birthdate)}</td>
                  <td style={tdStyle}>{m.email || "-"}</td>
                  <td style={tdStyle}>{m.gender || "-"}</td>
                  <td style={{...tdStyle, ...{
                    textAlign:"left" , borderLeft:"1px solid rgb(235, 235, 235)"  ,
                    boxShadow:" -18px -5px 15px -22px rgba(0,0,0,0.3)", 
                  }}}>
                    <button
                      style={{
                        border: "none",
                        background: "none",
                        color: "#444",
                        cursor: "pointer",
                      }}
                      onClick={() => alert(`ดู/แก้ไข ID: ${m.id}`)}
                    > 
                      👁 ดู & แก้ไข
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
    )
}
export default MooID;


const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "0.75rem",
  fontSize: "0.95rem",
};

const tdStyle: React.CSSProperties = {
  padding: "0.75rem",
  fontSize: "0.95rem",
  color: "#333",
};
