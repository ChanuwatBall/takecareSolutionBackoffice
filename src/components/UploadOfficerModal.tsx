import  { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import type { ChangeEvent, DragEvent } from 'react';
import "./css/UploadOfficerModal.css"
import { exportMemberTemplate } from './PrintExcel';


interface Officer {
  name: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  allowedTopicIds: string;
  companyId: number;
  role: string;
  token: string | null;
}

const UploadOfficerModal = ({uploadHandler}:any) => {
  const [open ,setOpen] = useState(false)
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null); 
 

  const handleSubmit = async() => {
    setOpen(false)
    uploadHandler(officers)
    console.log('Saving officers...', officers); 
  };
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    };
  
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    };
   
    
  const handleFiles = async (files: FileList | null) => {
    console.log("handleFileUpload file ",files )
    const file = files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json<Officer>(ws);
      console.log("data ",data)
      setOfficers(data);
    };
    reader.readAsBinaryString(file);
  }


  return (
    <div className='upload-officer'>  
     <button className="btn text-black" onClick={()=>{setOpen(true)}} >  อัปโหลดข้อมูล </button>
    {/* <button></button> */}
   {open && <div className="modal">
    <div className="modal-content" style={{width:"70vw"}}>
      {/* <div className="modal"> */}
        <div className='set-center' style={{width:"100%", flexDirection:"row" , justifyContent:"space-between", alignItems:"flex-start"}} >
          <label style={{lineHeight:"1.1rem"}}>
            <h2 className='text-left'  style={{margin:"0px"}}>
              เพิ่มเจ้าหน้าที่ 
            </h2>
            <p className='text-left'>ไฟล์: <strong>{fileName}</strong></p>
           </label>
           <button onClick={()=>exportMemberTemplate()} 
            style={{
                width:"fit-content" ,
                padding:".5rem",
                background:"transparent",
                fontSize:"small" , 
                color:"#000"
            }} 
          >
          ดาวน์โหลด Template 
        </button>
        </div> <br/>

        {!officers.length ? ( 
           <div style={{height:"10rem"}}
            className={`set-center upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            >
            <p>ลาก & วางไฟล์ที่นี่<br/>หรือคลิกเพื่อเลือกไฟล์</p>
              <input
              ref={fileInputRef}
              type="file"  accept=".xlsx, .xls" 
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            </div> 
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th style={{width:"10%"}}>ชื่อจริง</th>
                  <th>นามสกุล</th>
                  <th>Email</th>
                  <th>เบอร์โทร</th>
                  <th className='text-center' >เรื่องร้องทุกข์</th>
                  <th>สิทธิ</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {officers.map((o, i) => (
                  <tr key={i}>
                    <td>{o.name}</td>
                    <td>{o.username}</td>
                    <td>{o.email}</td>
                    <td>{o.phoneNumber}</td>
                    <td>{o.allowedTopicIds?.split(',')}</td>
                    <td>{o.role}</td>
                    <td> 
                      <button style={{padding:".2rem .8rem .2rem"}} >
                        <small>DEL</small>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )} <br/>
        <div className="modal-actions " style={{margin:"0px",marginTop:".5rem"}}>
          <button  type='reset' onClick={()=>{setOpen(false);setOfficers([])}} >ยกเลิก</button>  &nbsp; 
          <button  type='submit' onClick={()=>handleSubmit()}  disabled={officers.length > 0 ? false : true}  >บันทึก</button>
        </div>
        
      </div> 
    </div>}
    </div>
  );
};

export default UploadOfficerModal;
