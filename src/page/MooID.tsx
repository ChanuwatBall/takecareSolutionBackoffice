import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { decodeBase64, getVillagersByVillage, updateVillager } from "../action";
import './css/Villager.css';
import { useAlert } from "../components/AlertContext";
import { PrintExcel } from "../components/PrintExcel";

 
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
 

  const MooID:React.FC=()=>{
    const { id } = useParams<{ id: any }>();
    const [members, setMembers] = useState<Villager[]>([ ]);
    const [search, setSearch] = useState("");
    const [village,setVillage] = useState<  any>(null); 
    const [showAlert] = useAlert();
 
    
    const getVillager=async()=>{
      console.log("village change ")
      const villageid = decodeBase64(id)
      const villager = await getVillagersByVillage({id:villageid})
      console.log("villager ",villager)
      setMembers(villager?.villager)
      setVillage(villager?.village)
    }
 
    useEffect(() => { 
      getVillager()
    }, [ window.location.pathname ]);

  const update=async(data:any)=>{

    console.log("update ",data)
    const result:any = await updateVillager(data)
    if(result?.result){ 
       showAlert(`อัปเดตสมาชิก ${data?.firstName} ${data?.lastName} สำเร็จ`, 'success') 
        getVillager()
     }else{
      showAlert( `อัปเดตสมาชิก ${data?.firstName} ${data?.lineName} ไม่สำเร็จ`,"error")
     }

  }

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
        <div className="set-center" style={{flexDirection:"row" , justifyContent:"flex-end",marginBottom:"2rem"}} >
                    {/* <button style={{
                        width:"fit-content" ,
                        padding:".5rem",
                        background:"#FFF",
                        fontSize:"small"
                    }} > 
                        ส่งออกเป็นไฟล์  &nbsp;
                        <img src="../icons/ionicons/chevron-down-outline.svg" style={{width:".8rem"}} /> 
                    </button> */}
                    <PrintExcel 
                      jsonData={members} 
                      sheetname={"Members"} 
                      filename={"สมาชิก"+ village?.name }             
                    />
                </div>
                
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
            minHeight:"15rem"
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
                      boxShadow:"-18px -5px 15px -22px rgba(0,0,0,0.1)", 
                  }}}> </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((v,index) => (
                <tr key={v.id}>
                  <td style={tdStyle}>{v.lineName}</td>
                  <td style={tdStyle}>{v.phoneNumber}</td>
                  <td style={tdStyle}>{v.firstName} {v.lastName}</td> 
                  <td style={tdStyle}>{v.birthDate}</td> 
                  <td style={tdStyle}>{calculateAge(v.birthDate)}</td>   
                  <td style={tdStyle}>{v.email}</td> 
                  <td style={tdStyle}>{genderText(v.gender)}</td> 
                  <th style={{...tdStyle,...{   
                      boxShadow:" -18px -5px 15px -22px rgba(0,0,0,0.3)", 
                      width: "10%" , position:"relative"
                  }}}> 
                   <div className="set-center" style={{left:0,top:0, width:"90%",height:"100%",zIndex:5,position:"absolute"}} >    
                       <ButtonEditMemberDialog  
                        villager={v} 
                        onSave={(data:any)=>{
                          console.log("update villager ",data);
                          update(data)
                        }}
                      /> 
                    </div>
                  
                   {index == 0 &&   <div style={{width:"100%",height:( filteredMembers.length+1)+"00%",  position:"absolute",top:"0",zIndex: 0,left:0,
                      boxShadow:"-18px -5px 15px -22px rgba(0,0,0,0.1)",background:"#FFF" ,  }} >
                         </div> }
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
  background:"white"
};

const tdStyle: React.CSSProperties = {
  padding: "0.75rem", 
  color: "#333",
  textAlign:"left",
  fontSize:".9em",
  borderBottom:"none"
};


  
 

const ButtonEditMemberDialog = ({ villager , onSave }:any) => {
  const [open, setOpen] = useState(false)
  const [villId ,setVillId] = useState(0) 
  // const [formData, setFormData] = useState<any>(data);
  const [firstName , setFistName] = useState("")
  const [email,setEmail] = useState("")
  const [lastName , setLastName] = useState("")
  const [phone , serPhone] = useState("")
  const [villageName , setVillageName] = useState("") 
  const [villageId , setVillageId] = useState(0) 
  const [subdistrict , setSubdistrictName] = useState("")
  const [birthDate , setBirthdate] = useState("")
  const [ adress , setAddress] = useState("")
  const [gender ,setGender] = useState("")
  const [lineName,setLineName] = useState("")
    const [showAlert] = useAlert();

   const assigntoform=(data:any)=>{
      setVillId(data?.id)
      setFistName(data?.firstName)
      setEmail(data?.email ? data?.email :"")
      setLineName(data?.lineName)

      setLastName(data?.lastName)
      serPhone(data?.phoneNumber)
      setVillageName(data?.villageName)
      setVillageId(data?.villageId)
      setBirthdate(data?.birthDate)
      setAddress(data?.address)
      setGender(data?.gender)
      setSubdistrictName(data?.subdistrictName)
    }

  const handleSave = (e:any) => {
          e.preventDefault();
    const isValidEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };
    if(!isValidEmail(email)){
      showAlert( `กรุณาระบุอีเมลล์ให้ถูกต้อง`,"warning")

      return null
    }

    const data ={ 
      id: villId ,
      firstName ,
      email,
      lastName , 
      phoneNumber: phone , 
      villageName: villageName ,  
      villageId: villageId ,
      subdistrictName: subdistrict ,  
      birthDate , 
      address: adress ,  
      gender , 
      lineName:lineName
    }
    console.log("data ",data )
    onSave(data); 
    setOpen(false)
  };

  useEffect(()=>{ 
   
  },[])
  
 
  return (<> 
   <button
         onClick={()=>{
          assigntoform(villager);
          setOpen(true) 
         }}
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
                      
      {open && <div className="modal" style={{zIndex:999, top:0 ,}}>
       <div className="modal-content" style={{width:"80vw",minHeight:"20rem", maxHeight:"90vh", overflowY:"scroll"}}>
        
        <label  className="text-left">ดู / แก้ไขสมาชิก</label><br/>
        <form onSubmit={(e)=>handleSave(e) } >
          <div  style={{width:"100%", display:"flex",flexDirection:"row"}}  > 
          <div style={{width:"50%"}} > 
            <label className="text-left">ชื่อ <br/>
              <input className="input" name="firstName" value={firstName} onChange={(e)=>{setFistName(e?.target.value)}} />
            </label>
            <label className="text-left" > นามสกุล<br/>
              <input className="input" name="lastName" value={lastName} onChange={(e)=>{setLastName(e?.target.value)}}  />
            </label>
            <label className="text-left" > เพศ <br/>
              <select  className="input" name="gender"  value={gender}  onChange={(e)=>{setFistName(e?.target.value)}}  >
                <option value="MALE">ชาย</option>
                <option value="FEMALE">หญิง</option>
              </select>
            </label>
            <label className="text-left" > วันเกิด<br/>
              <input className="input" type="date" name="birthDate"  value={birthDate}  onChange={(e)=>{setBirthdate(e?.target.value)}}  />
            </label>
            <label className="text-left" > ที่อยู่ <br/>
              <textarea className="input" name="address" value={adress}  onChange={(e)=>{setAddress(e?.target.value)}}  />
            </label>
          </div>
          <div style={{width:"50%", }} > 
            <label className="text-left" > ชื่อไลน์ <br/>
              <input className="input" name="linename"  value={lineName}  onChange={(e)=>{setLineName(e?.target.value)}}  />
            </label>
            <label className="text-left" > เบอร์โทร <br/>
              <input className="input" name="phoneNumber" maxLength={10} value={phone}  onChange={(e)=>{serPhone(e?.target.value)}} />
            </label>
            <label className="text-left" > อีเมล <br/>
              <input className="input" name="email"  
                  placeholder="example@example.com" 
                  value={email}  
                  onChange={(e)=>{setEmail(e?.target.value); }}   
               />
            </label>
            <label className="text-left" > หมู่บ้าน<br/>
              <input className="input"  disabled  value={villageName}  onChange={(e)=>{setVillageName(e?.target.value)}}  />
            </label>
            <label className="text-left" > ตำบล<br/>
              <input className="input"   disabled  value={subdistrict}  onChange={(e)=>{setSubdistrictName(e?.target.value)}}  />
            </label> 
          </div>
        </div>
        <div className="set-center" style={{width:"100%",flexDirection:"row", justifyContent:"flex-end"}}>
          <button type="submit"  >บันทึก</button> &nbsp;
          <button type="button" onClick={() =>{setOpen(false) }}>
            ยกเลิก
          </button>
        </div>
        </form>
    </div> 
  </div> }
 </>  );
};
 