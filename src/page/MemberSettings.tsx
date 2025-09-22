import  { useEffect, useMemo, useState } from 'react';
import { addMember, deleteMember, getMembers, uploadMember } from '../action';
import { useAlert } from '../components/AlertContext';
import Alert from '../components/Alert';
import UploadOfficerModal from '../components/UploadOfficerModal';
import './css/MemberSettingsPage.css';
import Select from 'react-select'

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
// const roles = [
//   {value:"admin" , label:"Admin"},
//   {value:"user" , label:"User"},
// ]
interface Member{
  id:  number
  name: string
  username: string
  password: string | any
  email:  string
  phoneNumber: string
  allowedTopicIds: string[]
  companyId:  number
  role: string
  token: string | any
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
  const [role , setRole] = useState<any>({ value: 'admin', label: 'Admin' })
  const [topic  , setTopic] = useState<any[]>([])

  // --- NEW: Pagination state ---
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // 5/10/20/50
  const roleOpts:any[] =[{ value: 'super_admin', label: 'Super Admin' },{ value: 'admin', label: 'Admin' },{ value: 'user', label: 'User' }]

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

  // --- UPDATED: search + memo ---
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return members;
    return members.filter((m:any) =>
      `${m?.name||''} ${m?.email||''} ${m?.phoneNumber||''}`.toLowerCase().includes(q)
    );
  }, [members, search]);

  // --- NEW: slice for current page ---
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clamp = (n:number, min:number, max:number) => Math.min(Math.max(n, min), max);
  const goToPage = (p:number) => setPage(clamp(p, 1, totalPages));

  // keep page in range when data changes
  useEffect(() => {
    setPage((p) => clamp(p, 1, totalPages));
  }, [totalPages, pageSize, filtered]);

  // reset to first page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageItems = filtered.slice(startIndex, endIndex);

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

  const setupForm=async(member:Member)=>{
    setFullName(member?.name)
    setEmail(member?.email)
    setPhone(member?.phoneNumber)
    setUsername(member?.username)
    setPassword(member?.password)
    const usrrole = await roleOpts.find((e)=> e.value ===member?.role)
    console.log("usrrole ",usrrole)
    setRole(usrrole)
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
    console.log( " submit role ",role)
    const form ={
      name: fullname ,
      email ,
      phoneNumber: phone ,
      username ,
      password ,
      role: role?role?.value :"admin" ,
      allowedTopicIds:topic  ,
    }
    const result= await addMember(form)
    if(result?.result){
      getmemnbers()
      showAlert('เพิ่ม/แก้ไข เจ้าหน้าที่สำเร็จ', 'success')
      setShowAddModal(false)
    }else{
      showAlert('เพิ่ม/แก้ไข เจ้าหน้าที่ไม่สำเร็จ',"error")
    }
    clearForm()
    console.log( " submit add form ",form)
  }

  const uploadofficer=async(officers:any)=>{
    console.log('Saving officers...', officers);
    let update = officers.map((e:any)=>({ ...e, allowedTopicIds: e.allowedTopicIds.split(",") }))
    console.log('update...', update);
    const result = await uploadMember(update)
    if(result?.result){
      getmemnbers()
      showAlert('เพิ่มเจ้าหน้าที่สำเร็จ', 'success')
    }else{
      showAlert('เพิ่มเจ้าหน้าที่ไม่สำเร็จ',"error")
    }
  }

  // --- NEW: tiny button style for pagination ---
  const pgBtn = (disabled:boolean): React.CSSProperties => ({
    padding: "0.35rem 0.6rem",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: disabled ? "#f5f5f5" : "#fff",
    color: disabled ? "#aaa" : "#333",
    cursor: disabled ? "not-allowed" : "pointer"
  });

  const PaginationBar = () => (
    <div  className="pagination-bar" style={{display:"flex", gap:"1rem", alignItems:"center", justifyContent:"space-between", margin:"0.5rem 0",fontSize:"small"}}>
      <div style={{ color: "#555", fontSize: 14 }}>
        แสดง {total === 0 ? 0 : startIndex + 1}-{endIndex} จาก {total} รายการ
      </div>
      <div style={{display:"flex", gap:"0.5rem", alignItems:"center"}}>
        <label style={{ color:"#555", fontSize:14 }}>ต่อหน้า:</label>
        <select
          value={pageSize}
          onChange={(e)=> setPageSize(parseInt(e.target.value,10))}
          style={{ padding:"0.3rem 0.5rem", borderRadius:8, border:"1px solid #ddd", background:"#fff" }}
        >
          {[5,10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <div style={{display:"flex", gap:6, alignItems:"center"}}>
          <button onClick={()=>goToPage(1)} disabled={page===1} style={pgBtn(page===1)}>« หน้าแรก </button>
          <button onClick={()=>goToPage(page-1)} disabled={page===1} style={pgBtn(page===1)}>‹ ก่อนหน้า</button>
          <span style={{ color:"#555", minWidth:90, textAlign:"center" }}>หน้า {page}/{totalPages}</span>
          <button onClick={()=>goToPage(page+1)} disabled={page===totalPages} style={pgBtn(page===totalPages)}>ถัดไป ›</button>
          <button onClick={()=>goToPage(totalPages)} disabled={page===totalPages} style={pgBtn(page===totalPages)}>สุดท้าย »</button>
        </div>
      </div>
    </div>
  );

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

      <div style={{width:"100%",display:"flex", justifyContent: "space-between" ,alignItems:"flex-start"}} >
        <input
          className='input-search '
          placeholder="ค้นหาจาก ชื่อ หรือ หมายเลขโทรศัพท์"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={{ display:"flex", justifyContent: "space-between" ,alignItems:"flex-start"}} >
          <UploadOfficerModal uploadHandler={(data:any)=>{uploadofficer(data)}} /> &nbsp;
          <div className="dropdown">
            <button className="btn text-black" onClick={()=>{setFilter(prev => prev = !prev)}}>กรอง ▾</button>
            { filter && <div className="dropdown-content">
              {columns.map((col) => (
                <div key={col.key} className='text-left'>
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
      </div>

      {/* NEW: top pagination */}
      <PaginationBar />

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {visibleCols.map(
                (col) => !col.hidden && <th key={col.key}>{col.label}</th>
              )}
              <th style={{width:"10%"}}></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.filter(c=>!c.hidden).length + 1} style={{ textAlign:"center", color:"#777", padding:"1rem"}}>
                  ไม่พบรายการ
                </td>
              </tr>
            ) : (
              pageItems.map((member:any) => (
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
                  <td className="actions"  >
                    <button className="icon-btn" onClick={()=>{setMember(member);setupForm(member);setShowAddModal(true); console.log("member ",member)}} >
                      <img style={{width:"1rem"}} src="../icons/ionicons/create-outline.svg" />
                    </button>
                    <button className="icon-btn" onClick={()=>{setMember(member);setMessage("ยืนยันลบเจ้าหน้าที่ "+member?.name); setIsOpen(true)}}  >
                      <img style={{width:"1rem"}} src="../icons/ionicons/trash-outline.svg" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div> <br/><br/><br/><br/><br/><br/>
 

      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{fullname ? "แก้ไข" :"เพิ่ม" }เจ้าหน้าที่</h3>
            <div className='set-center' style={{textAlign:"left", flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-start"}} >
              <div style={{width:"50%"}}>
                <input className="input" placeholder="ชื่อ-นามสกุล" type="text" value={fullname} onChange={(e:any)=>{setFullName(e.target.value) }} />
                <input className="input" placeholder="Email" type="text" value={email} onChange={(e:any)=>{setEmail(e.target.value)}} />
                <input className="input" placeholder="Phone Number" type="tel" maxLength={10}  value={phone} onChange={(e:any)=>{setPhone(e.target.value)}} />
                <input className="input" placeholder="Username" type="text" value={username} onChange={(e:any)=>{setUsername(e.target.value)}}  />
                <input  className="input" placeholder="Password" type="text"  value={password} onChange={(e:any)=>{setPassword(e.target.value)}}  />
              </div>
              <div style={{width:"50%"}}>

                <Select  value={role}  options={roleOpts} onChange={(e)=>{setRole(e); console.log(" setRole ",e)}} /><br/>
                <label className='text-left' style={{marginLeft:"1rem",fontSize:".9em"}}>Allowed Topics</label>

                <div style={{width:"100%" , padding:"0 .5rem 0 .5rem"}} >
                  {topicChoise.map((e:any,index:any)=> (
                    <div key={index} style={{textAlign:"left", float:"left" ,padding:"0 .5rem 0 .5rem"}}>
                      <input
                        type="checkbox"
                        checked={topic.includes(e.value)}
                        onChange={() => handleChange(e.value)}
                      />  {e.label}
                    </div>
                  ))}
                </div>
              </div>
             
            </div>
              <div className="modal-actions">
                <button type="reset" onClick={() =>{clearForm(); setShowAddModal(false) }}>
                  ยกเลิก
                </button>
                <button type="submit" onClick={()=>{submit() }} >บันทึก</button>
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
