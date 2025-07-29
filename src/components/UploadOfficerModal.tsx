import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import "./css/UploadOfficerModal.css"

interface Officer {
  name: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  allowedTopicIds: string[];
  companyId: number;
  role: string;
  token: string | null;
}

const UploadOfficerModal = () => {
  const [open ,setOpen] = useState(false)
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json<Officer>(ws);
      setOfficers(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = () => {
    console.log('Saving officers...', officers);
    // TODO: Submit to backend
  };

  return (
    <div className='upload-officer'>  
     <button className="btn" onClick={()=>{setOpen(true)}} >  อัปโหลดข้อมูล </button>
    {/* <button></button> */}
   {open &&  <div className="modal-overlay">
      <div className="modal">
        <h2>เพิ่มเจ้าหน้าที่</h2>

        {!officers.length ? (
          <label htmlFor="file-upload" className="drop-zone">
            <input
              id="file-upload"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              hidden
            />
            <p>ลาก & วางไฟล์ที่นี่<br />คลิกเพื่ออัปโหลด</p>
          </label>
        ) : (
          <>
            <p>ไฟล์: <strong>{fileName}</strong></p>
            <table>
              <thead>
                <tr>
                  <th>ชื่อจริง</th>
                  <th>นามสกุล</th>
                  <th>Email</th>
                  <th>เบอร์โทร</th>
                  <th>สิทธิ์</th>
                  <th>บทบาท</th>
                </tr>
              </thead>
              <tbody>
                {officers.map((o, i) => (
                  <tr key={i}>
                    <td>{o.name}</td>
                    <td>{o.username}</td>
                    <td>{o.email}</td>
                    <td>{o.phoneNumber}</td>
                    <td>{o.allowedTopicIds?.join(', ')}</td>
                    <td>{o.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="submit-btn" onClick={handleSubmit}>บันทึก</button>
          </>
        )}
      </div>
 
    </div>}
    </div>
  );
};

export default UploadOfficerModal;
