import React, { useEffect, useState } from 'react';
import './css/MemberSettingsPage.css';

const columns = [
  { key: 'name', label: 'ชื่อ-นามสกุล' },
  { key: 'email', label: 'อีเมล' },
  { key: 'phone_number', label: 'หมายเลขโทรศัพท์' },
  { key: 'username', label: 'Username', hidden: true },
  { key: 'password', label: 'Password', hidden: true },
  { key: 'role', label: 'Role', hidden: true },
  { key: 'allowedTopicIds', label: 'หัวข้อร้องเรียน', hidden: true }
];

const dummyData = [
  {
    id: 1,
    name: 'Super Admin',
    username: 'admin',
    password: 'superadmin',
    role: 1,
    allowedTopicIds: ['trash', 'water'],
    phone_number: '-',
    email: '-'
  },
  {
    id: 2,
    name: 'Suppakit',
    username: 'suppakit',
    password: '123456',
    role: 3,
    allowedTopicIds: ['trash', 'water'],
    phone_number: '0900000000',
    email: 'suppakit01@gmail.com'
  }
];

const MemberSettings = () => {
  const [members, setMembers] = useState(dummyData);
  const [search, setSearch] = useState('');
  const [visibleCols, setVisibleCols] = useState(columns);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter,setFilter] = useState(false)

  const [topicChoise , setTopicChoise] = useState([ "trash","road" , "water","heat","animals","maintenance", "trees", "clean", "other"])
 
  const [fullname , setFullName] = useState("")
  const [email , setEmail] = useState("")
  const [phone , setPhone] = useState("")
  const [username , setUsername] = useState("")
  const [password , setPassword] = useState("")
  const [role , setRole] = useState("")
  const [topic  , setTopic] = useState([])
  const [topicStr , setTopicStr] = useState("")

    // <input placeholder="ชื่อ-นามสกุล"  />
    //           <input placeholder="Email" />
    //           <input placeholder="Phone Number" />
    //           <input placeholder="Username" />
    //           <input placeholder="Password" />
    //           <input placeholder="Role" />
    //           <input placeholder="Allowed Topics 

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
      m.phone_number.includes(search)
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
                      <td key={col.key}>
                        {Array.isArray(member[col.key])
                          ? member[col.key].join(', ')
                          : member[col.key]}
                      </td>
                    )
                )}
                <td className="actions">
                  <button className="icon-btn">✏️</button>
                  <button className="icon-btn">🗑️</button>
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
              {/* Add fields from member table */}
              <input placeholder="ชื่อ-นามสกุล" value={fullname} onChange={(e:any)=>{setFullName(e.target.value) }} />
              <input placeholder="Email"  value={email} onChange={(e:any)=>{setEmail(e.target.value)}} />
              <input placeholder="Phone Number"  value={phone} onChange={(e:any)=>{setPhone(e.target.value)}} />
              <input placeholder="Username"  value={username} onChange={(e:any)=>{setUsername(e.target.value)}}  />
              <input placeholder="Password"  value={password} onChange={(e:any)=>{setPassword(e.target.value)}}  />
              <input placeholder="Role"  value={role} onChange={(e:any)=>{}}  />
              <input placeholder="Allowed Topics (comma-separated)" />
              <div className="modal-actions">
                <button type="submit">บันทึก</button>
                <button type="button" onClick={() => setShowAddModal(false)}>
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberSettings;