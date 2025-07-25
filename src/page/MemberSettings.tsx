import  { useEffect, useState } from 'react';
import './css/MemberSettingsPage.css';
import { addMember, deleteMember, getMembers } from '../action';
import { useAlert } from '../components/AlertContext';
import Alert from '../components/Alert';

const columns = [
  { key: 'name', label: 'ชื่อ-นามสกุล' },
  { key: 'email', label: 'อีเมล' },
  { key: 'phoneNumber', label: 'หมายเลขโทรศัพท์' },
  { key: 'username', label: 'Username', hidden: true },
  { key: 'password', label: 'Password', hidden: true },
  { key: 'role', label: 'Role', hidden: true },
  { key: 'allowedTopicIds', label: 'หัวข้อร้องเรียน', hidden: true }
];
 
const complaintTitile = [ 
    {value:"trash" , label:"ขยะ"},
    {value:"road"  , label:"ถนน"},
    {value: "water" , label:"น้ำประปา"},
    {value:"heat" , label:"เหตุเดือดร้อน / รำคาญ"},
    {value:"animals" , label:"สัตว์จรจัด"},
    {value:"maintenance" , label:"ซ่อมแซม"},
    {value: "trees" , label:"ตัดต้นไม้"},
    {value: "clean" , label:"ความสะอาด"},
    {value: "other", label:"อื่นๆ"}
  ]
const roles = [
    {value:"admin" , label:"Admin"},
    {value:"user" , label:"User"}, 
]
interface Member{
    "id":  number
    "name": string
    "username": string
    "password": string | any
    "email":  string
    "phoneNumber": string
    "allowedTopicIds": string[]
    "companyId":  number
    "role": string
    "token": string | any
}
const MemberSettings = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [visibleCols, setVisibleCols] = useState(columns);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter,setFilter] = useState(false)

  const [member,setMember] = useState<Member | null>(null)
  const [topicChoise  ] = useState(complaintTitile)
  const [isOpen ,setIsOpen ] = useState(false)
  const [message ,setMessage ] = useState("")
 
  const [fullname , setFullName] = useState("")
  const [email , setEmail] = useState("")
  const [phone , setPhone] = useState("")
  const [username , setUsername] = useState("")
  const [password , setPassword] = useState("")
  const [role , setRole] = useState("")
  const [topic  , setTopic] = useState<any[]>([])
  
  const [showAlert] = useAlert();

   
  const getmemnbers=async()=>{
    const members = await getMembers()
    console.log("members ",members)
    setMembers(members)
  }

  useEffect(()=>{ 
    getmemnbers()
  },[])

  const toggleColumn = (key:any) => {
    setVisibleCols((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, hidden: !col.hidden } : col
      )
    );
  };

  const filtered = members.filter(
    (m) =>
      m.name.includes(search) ||
      m.email.includes(search) ||
      m.phoneNumber.includes(search)
  );


  const handleChange = (value: string) => {
    setTopic((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const deleteMemberHandler=async ()=>{
    const result = await deleteMember(member)
     if(result?.result){
       getmemnbers()
       showAlert('ลบ'+member?.name+'สำเร็จ', 'success')
     }else{
      showAlert('ลบ'+member?.name+'ไม่สำเร็จ',"error")
     }
  }

  const setupForm=(member:Member)=>{
    setFullName(member?.name)
    setEmail(member?.email)
    setPhone(member?.phoneNumber)
    setUsername(member?.username)
    setPassword(member?.password)
    setRole(member?.role)
    setTopic(member?.allowedTopicIds)
  }
  const clearForm=()=>{
    setFullName("")
    setEmail("")
    setPhone("")
    setUsername("")
    setPassword("")
    setRole("")
    setTopic([])
  }

  const submit=async ()=>{
    const form ={
      name: fullname ,
      email ,  
      phoneNumber: phone , 
      username ,  
      password , 
      role ,  
      topic  ,  
    }
    const result= await addMember(form)
    if(result?.result){ 
       showAlert('เพิ่มเจ้าหน้าที่สำเร็จ', 'success')
       setShowAddModal(false)
     }else{
      showAlert('เพิ่มเจ้าหน้าที่ไม่สำเร็จ',"error")
     }
    console.log( " submit add form ",form)
  }

  return (
    <div className="member-settings">
      
      <div className="toolbar">
       <h2>ตั้งค่าเจ้าหน้าที่</h2> 
       <div style={{ display:"flex", justifyContent:"flex-start"}} > 
        <button className="btn blue" onClick={() => setShowAddModal(true)}>
          เพิ่มเจ้าหน้าที่
        </button> &nbsp;
       
        </div>
      </div>
      <div   style={{width:"100%",display:"flex", justifyContent: "space-between" ,alignItems:"flex-start"}} >

       <input
       className='input-search '
          placeholder="ค้นหาจาก ชื่อ หรือ หมายเลขโทรศัพท์"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

         <div className="dropdown">
          <button className="btn" onClick={()=>{setFilter(prev => prev = !prev)}}>กรอง ▾</button>
          { filter && <div className="dropdown-content">
            {columns.map((col) => (
              <div key={col.key} className='text-left'
                 >
                <input
                  type="checkbox"
                  checked={!visibleCols.find((c) => c.key === col.key)?.hidden}
                  onChange={() => toggleColumn(col.key)}
                />{' '}
                {col.label}
              </div>
            ))}
          </div>}
        </div>
      </div>

      <div className="table-wrapper">
        
        <table>
          <thead>
            <tr>
              {visibleCols.map(
                (col) => !col.hidden && <th key={col.key}>{col.label}</th>
              )}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member:any) => (
              <tr key={member.id}>
                {visibleCols.map(
                  (col) =>
                    !col.hidden && (
                      <td key={col.key} className='text-left' style={{textAlign:"left"}} >
                        {Array.isArray(member[col.key])
                          ? member[col.key].join(', ')
                          : member[col.key]}
                      </td>
                    )
                )}
                <td className="actions" style={{width:"5%"}}>
                  <button className="icon-btn" onClick={()=>{setMember(member);setupForm(member);setShowAddModal(true); console.log("member ",member)}} >
                    <img style={{width:"1rem"}} src="../icons/ionicons/create-outline.svg" />
                  </button>
                  <button className="icon-btn" onClick={()=>{setMember(member);setMessage("ยืนยันลบเจ้าหน้าที่ "+member?.name); setIsOpen(true)}}  >
                    <img style={{width:"1rem"}} src="../icons/ionicons/trash-outline.svg" /> 
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>เพิ่มเจ้าหน้าที่</h3>
            <div> 
              <input placeholder="ชื่อ-นามสกุล" type="text" value={fullname} onChange={(e:any)=>{setFullName(e.target.value) }} />
              <input placeholder="Email" type="text" value={email} onChange={(e:any)=>{setEmail(e.target.value)}} />
              <input placeholder="Phone Number" type="text"  value={phone} onChange={(e:any)=>{setPhone(e.target.value)}} />
              <input placeholder="Username" type="text" value={username} onChange={(e:any)=>{setUsername(e.target.value)}}  />
              <input placeholder="Password" type="text"  value={password} onChange={(e:any)=>{setPassword(e.target.value)}}  />
               
                <select className='input' aria-placeholder='Role' style={{width:"92%" }} value={role} onChange={(e)=>{setRole(e.target.value)}} >
                  {roles.map((r:any, index:any)=>  <option key={index} value={r.value}> { r.label } </option>) } 
                </select>
              
              <label className='text-left' style={{marginLeft:"1rem",fontSize:".9em"}}>Allowed Topics</label>
              
              <div style={{width:"100%" , padding:"0 .5rem 0 .5rem"}} >
                {
                  topicChoise.map((e:any,index:any)=> <div key={index} style={{textAlign:"left", float:"left" ,padding:"0 .5rem 0 .5rem"}}>
                  <input
                    type="checkbox" 
                    checked={topic.includes(e.value)}
                    onChange={() => handleChange(e.value)}
                  />  {e.label} </div>
                  )
                }
              </div> 
              <div className="modal-actions">
                <button type="submit" onClick={()=>{submit() }} >บันทึก</button>
                <button type="button" onClick={() =>{clearForm(); setShowAddModal(false) }}>
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

       <Alert
        isOpen={isOpen}
        setOpen={setIsOpen}
        title="แจ้งเตือน"
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
              handler: () => {
                deleteMemberHandler()
              }
            },
        ]}
        />
    </div>
  );
};

export default MemberSettings;