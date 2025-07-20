import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { decodeBase64, getVillagersByVillage } from "../action";


  interface Member {
    id: string;
    username: string;
    phone: string;
    fullName: string;
    birthdate: string; // ISO date string
    email?: string;
    gender?: string;
  }
  interface Villager {
      id: number
      lineName: string
      firstName: string
      lastName:string
      phoneNumber: string
      birthDate: string
      address: string
      gender: string
      agreePolicy: true,
      villageId:number
      villageName: string
      subdistrictId: number
      subdistrictName: string
      companyId:number
      companyName: string
      createdAt: null
      email: string
  }

  interface Village{
    id: number
    name:  string
}

  const MooID:React.FC=()=>{
    const { id } = useParams<{ id: any }>();
    const [members, setMembers] = useState<Villager[]>([ ]);
    const [search, setSearch] = useState("");
    const [village,setVillage] = useState<Village | any>(null);
  

  useEffect(() => { 
    const villageid = decodeBase64(id)
    const getVillager=async()=>{
      const villager = await getVillagersByVillage({id:villageid})
      console.log("villager ",villager)
      setMembers(villager?.villager)
      setVillage(villager?.village)
    }
    getVillager()
  }, [id ]);

  const filteredMembers = members.filter((m) =>
    `${m.firstName} ${m.lastName} ${m.phoneNumber}`.toLowerCase().includes(search.toLowerCase())
  );

    const calculateAge = (birthdate: string) => {
      const dob = new Date(birthdate);
      const now = new Date();
      return now.getFullYear() - dob.getFullYear();
    };

    const genderText = (g: string) => g === 'MALE' ? 'ชาย' : g === 'FEMALE' ? 'หญิง' : 'ไม่ระบุ';

    return(
    <div className="moo-page" >
       <div style={{ background: "#f2f2f2", padding: "2rem", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ fontWeight: 500, marginBottom: "1rem" ,textAlign:"left"}}>
          รายชื่อสมาชิก{ village?.name }
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
          <span style={{ fontSize: "1.5rem", color: "#aaa" }}>
               <img src="../icons/ionicons/search-outline.svg" style={{width:"1.5rem" }} /> 
          </span>
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
          <table style={{ width: "100%", borderCollapse: "collapse",fontSize:".8em" }}>
            <thead style={{ color: "#555", fontWeight: 500 , borderBottom :"1px solid #E0E0E0" }}>
              <tr> 
                  <th style={thStyle} >ชื่อไลน์</th>
                  <th style={thStyle} > หมายเลขโทรศัพท์ </th>

                  <th style={thStyle} >ชื่อ-นามสกุล</th>  
                  <th style={thStyle} >วันเกิด</th>
                  <th style={thStyle} >อายุ</th>
                  <th style={thStyle} >อีเมลล์</th> 
                  <th style={thStyle} >เพศ</th> 
                  <th style={{...thStyle,...{  
                      borderLeft:"1px solid rgb(235, 235, 235)"  ,
                      boxShadow:" -18px -5px 15px -22px rgba(0,0,0,0.3)", 
                  }}}> </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((v) => (
                <tr key={v.id}>
                  <td style={tdStyle}>{v.lineName}</td>
                  <td style={tdStyle}>{v.phoneNumber}</td>
                  <td style={tdStyle}>{v.firstName} {v.lastName}</td> 
                  <td style={tdStyle}>{v.birthDate}</td> 
                  <td style={tdStyle}>{calculateAge(v.birthDate)}</td>   
                  <td style={tdStyle}>{v.email}</td> 
                  <td style={tdStyle}>{genderText(v.gender)}</td> 
                  <th style={{...tdStyle,...{  
                      borderLeft:"1px solid rgb(235, 235, 235)"  ,
                      boxShadow:" -18px -5px 15px -22px rgba(0,0,0,0.3)", 
                      width: "10%"
                  }}}> 
                   <button
                      className="set-center"
                      style={{
                        flexDirection:"row",
                        border: "none",
                        background: "none",
                        color: "#848387",
                        cursor: "pointer",
                        padding:"3px",
                        fontSize:".8em"
                      }}  
                  >
                    <img src="../icons/ionicons/eye-outline.svg" style={{width:".8rem",marginRight:".5rem"}} /> 
                      <label>
                        <small>ดู & แก้ไข</small>
                    </label>
                  </button>
                    
                  </th>
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
  fontSize: "0.8rem", 
};

const tdStyle: React.CSSProperties = {
  padding: "0.75rem", 
  color: "#333",
  textAlign:"left",
  fontSize:".9em"
};
