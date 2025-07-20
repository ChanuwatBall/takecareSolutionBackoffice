import { useState } from "react";
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


const Member=()=>{
    const { id } = useParams<{ id: any }>();
    const [members, setMembers] = useState<Member[]>([])
    const [search, setSearch] = useState("");

     const filteredMembers = members.filter((m:any) =>
        `${m.firstName} ${m.lastName} ${m.phoneNumber}`.toLowerCase().includes(search.toLowerCase())
    );
    const calculateAge = (birthdate: string) => {
        const dob = new Date(birthdate);
        const now = new Date();
        return now.getFullYear() - dob.getFullYear();
    };




    return(<div className="moo-page" >
       <div style={{ background: "#f2f2f2", padding: "2rem", minHeight: "100vh" }}>

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
    </div>)
}
export default Member;



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
