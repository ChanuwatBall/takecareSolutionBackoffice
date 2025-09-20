import React, { useEffect, useMemo, useState ,useRef } from "react"; 
import type { ChangeEvent, DragEvent } from 'react';
import { useParams } from "react-router-dom";
import { complaintslist, updateComplaintSts } from "../action";
import "./css/Complaint.css"
import { useAlert } from "../components/AlertContext";
import { PrintExcelComplaint } from "../components/PrintExcel";
import Resizer from "react-image-file-resizer";

const apiUrl = import.meta.env.VITE_API;

export interface Complaint {
  id: string;
  phone: string;
  supTitle: string;
  detail: string;
  status: 'pending' | "done" | 'in-progress' | string;
  villager: number;
  topicId: number;
  imageIds: string[];
}

const resizeFile = (file:any) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      500,
      1200,
      "JPG",
      70,
      0,
      (File) => {
        resolve(File);
      },
      "file"
    );
  });


const ComplaintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [showAlert] = useAlert();

  // --- NEW: Pagination state ---
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);
  const goToPage = (p: number, totalPages: number) => setPage(clamp(p, 1, totalPages));

  const getComplaints = async () => {
    const data = await complaintslist(id);
    setComplaints(data || []);
  };

  useEffect(() => {
    getComplaints();
  }, [id]);

  const updateConplaintStatus = async (complaintId: any, newstatus: any) => {
    const form = { id: complaintId, status: newstatus };
    const result = await updateComplaintSts(form);
    if (result?.result) {
      getComplaints();
      showAlert('อัปเดตสถานะ สำเร็จ', 'success');
    } else {
      showAlert('อัปเดสถานะ ไม่สำเร็จ', "error");
    }
  };

  // (เผื่ออนาคตมีตัวกรอง/ค้นหา ก็แยกไว้เป็น useMemo)
  const rows = useMemo(() => complaints, [complaints]);

  // --- NEW: Pagination calculations ---
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => { setPage((p) => clamp(p, 1, totalPages)); }, [totalPages, pageSize, rows]);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageItems = rows.slice(startIndex, endIndex);

  // --- NEW: Pagination UI ---
  const pgBtn = (disabled: boolean): React.CSSProperties => ({
    padding: "0.35rem 0.6rem",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: disabled ? "#f5f5f5" : "#fff",
    color: disabled ? "#aaa" : "#333",
    cursor: disabled ? "not-allowed" : "pointer"
  });
  const PaginationBar = () => (
    <div  className="pagination-bar" style={{display:"flex", gap:"1rem", alignItems:"center", justifyContent:"space-between", margin:"0.75rem 0" , fontSize:"small"}}>
      <div style={{ color:"#555", fontSize:14 }}>
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
          <button onClick={()=>goToPage(1, totalPages)} disabled={page===1} style={pgBtn(page===1)}>« หน้าแรก</button>
          <button onClick={()=>goToPage(page-1, totalPages)} disabled={page===1} style={pgBtn(page===1)}>‹ ก่อนหน้า</button>
          <span style={{ color:"#555", minWidth:90, textAlign:"center" }}>หน้า {page}/{totalPages}</span>
          <button onClick={()=>goToPage(page+1, totalPages)} disabled={page===totalPages} style={pgBtn(page===totalPages)}>ถัดไป ›</button>
          <button onClick={()=>goToPage(totalPages, totalPages)} disabled={page===totalPages} style={pgBtn(page===totalPages)}>สุดท้าย »</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="set-center" style={{flexDirection:"row" , justifyContent:"flex-end",marginBottom:"2rem"}} >
          <PrintExcelComplaint jsonData={complaints} />
        </div>

        <h2 style={{ marginBottom: "1.5rem" ,textAlign:"left" }}>เรื่องร้องทุกข์</h2>

        {/* TOP pagination */}
        <PaginationBar />

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", fontWeight: 500, color: "#555" }}>
                <th style={{...th ,...{
                  textAlign:"center" , borderRight:"1px solid rgb(246, 246, 246)"  ,
                  boxShadow:"7px 2px 14px -8px rgba(0,0,0,0.2)",
                }}}>รายการ</th>
                <th style={{...th, ...{paddingLeft:"1.5rem"}}}>หมายเลขโทรศัพท์</th>
                <th style={th}>หัวข้อเรื่องย่อย</th>
                <th style={th}>รายละเอียด</th>
                <th style={th} className="text-center">ดูรูปภาพ</th>
                <th style={th} className="text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...td, textAlign:"center", color:"#777", padding:"1rem" }}>
                    ไม่พบเรื่องร้องเรียน
                  </td>
                </tr>
              ) : (
                pageItems.map((item, index) => {
                  const displayIndex = startIndex + index + 1; // เลขต่อเนื่องข้ามหน้า
                  return (
                    <tr key={item.id}>
                      <td style={{...td,...{
                        position:"relative",
                        textAlign:"center"
                      }}}>
                        <div className="text-center" style={{width:"90%",height:"100%",zIndex:5,position:"absolute"}}>
                          {displayIndex}
                        </div>
                        {index === 0 && (
                          <div style={{
                            width:"100%", position:"absolute", top:0, left:0, zIndex:0,
                            boxShadow:"7px 2px 14px -8px rgba(0,0,0,0.1)", background:"#FFF"
                          }} />
                        )}
                      </td>
                      <td style={{...td, ...{paddingLeft:"1.5rem"}}}>{item.phone}</td>
                      <td style={td}>{item?.supTitle}</td>
                      <td style={td}>{item.detail}</td>
                      <td style={td} className="set-center">
                        <ButtonViewImages complaint={item} />
                      </td>
                      <td style={{...td, ...{textAlign:"center"}}}>
                        <ComplaintStatus
                          value={item.status}
                          update={(newsts)=> updateConplaintStatus(item?.id, newsts)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* BOTTOM pagination */}
        <PaginationBar />
      </div>
    </div>
  );
};

const ButtonViewImages = ({ complaint }: any) => {
  const [openModal , setOpenModal] = useState(false)
  const [current , setCurrent] = useState(0)

  useEffect(()=>{ console.log("complaint  ", complaint) },[])
  return (
    <>
      <button style={viewBtnStyle} onClick={()=> setOpenModal(true)}>ดูรูปภาพ</button>
      {openModal && (
        <div className="modal">
          <div className="modal-content" style={{width:"70vw"}}>
            <h3 style={{margin:"0px"}}>เรื่องร้องเรียน</h3>
            <label>{complaint?.supTitle}</label><br/>
            <div className="contetnt" style={{display:"flex", flexDirection:"row"}}>
              <div className="set-center" style={{width:"30%",height:"60vh",overflow:"scroll",paddingTop:"5rem"}}>
                {complaint?.imageIds.map((image:any, i:any)=>
                  <img key={i}
                    src={apiUrl+`/api/file/drive-image/${image}`}
                    alt={`complaint-images-${i}`}
                    style={{height:"8rem",padding:".3rem"}}
                    onClick={()=> setCurrent(i)}
                  />
                )}
              </div>
              <div style={{width:"70%"}} className="set-center">
                <img
                  src={apiUrl+`/api/file/drive-image/${complaint?.imageIds[current]}`}
                  alt={`complaint-images-${current}`}
                  style={{width:"auto", maxWidth:"100%", maxHeight:"50vh"}}
                />
              </div>
            </div>
            <div className="modal-actions" style={{margin:"0px"}}>
              <button type="button" onClick={() => setOpenModal(false)}>ปิด</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const th: React.CSSProperties = {
  padding: "0.75rem",
  fontSize: "1rem",
  backgroundColor:"none"
};

const td: React.CSSProperties = {
  padding: "0.5rem",
  fontSize:"smaller",
  color: "#333",
  textAlign:"left",
  borderBottom:"none"
};

const viewBtnStyle: React.CSSProperties = {
  background: "#4c92fcff",
  border: "none",
  borderRadius: "12px",
  padding: "0.25rem 0.75rem",
  cursor: "pointer",
  fontSize: "smaller",
  width:"6rem" 
};

// const navBtnStyle: React.CSSProperties = {
//   border: "none",
//   background: "#eee",
//   borderRadius: "50%",
//   width: "36px",
//   height: "36px",
//   cursor: "pointer",
//   color:"black"
// };
type ImageData = {
  file: File;
  preview: string;
  isCover: boolean;
};
export type ComplaintStatusType = 'pending' | 'in-progress' | 'done';
interface ComplaintStatusProps {
  value: ComplaintStatusType;
  update: (newStatus: ComplaintStatusType) => void;
}
const STATUS_LABEL: Record<ComplaintStatusType, string> = {
  pending: 'รอดำเนินการ',
  'in-progress': 'กำลังดำเนินการ',
  done: 'เสร็จเรียบร้อย',
};

export const ComplaintStatus: React.FC<ComplaintStatusProps> = ({ value, update }) => {
  const [open, setOpen] = useState(false);
  const toggleDropdown = () => setOpen(!open);
  const [upload,setUpload] = useState(false)
    const [images, setImages] = useState<ImageData[]>([]);
    const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const succesUpload=(status: ComplaintStatusType)=>{ 
    if(status != "done"){
      update(status); 
      setOpen(false); 
    }else{
      setUpload(true)
    } 
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    console.log("file ", files) 
   
    const fileArray = Array.from(files);

    const imageslist:any[] = await Promise.all(
      fileArray.map(async (file) => {
        const fileresize = await resizeFile(file);
        return {
          file: fileresize,
          preview: URL.createObjectURL(file),
          isCover: false,
        };
      })
    );

     console.log("imageslist ", imageslist)
    // const newImages: ImageData[] = Array.from(files).map((file) => ({
    //   file,
    //   preview: URL.createObjectURL(file),
    //   isCover: false,
    // })); 
    setImages((prev) => [...prev, ...imageslist]);
  };

  
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    };
  
    const handleFileChange = (e:any|ChangeEvent<HTMLInputElement>) => {
      const maxSizeMB = 2; // limit 2MB
      const files:any = Array.from(e.target.files);
  
      const validFiles = files.filter((file:any) => {
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`❌ ${file.name} is larger than ${maxSizeMB} MB`);
          return false;
        }
        return true;
      });
      if (validFiles.length) {
         handleFiles(e.target.files);
         setError("")
      }
    };
  
    const handleSetCover = (index: number) => {
      setImages((prev) =>
        prev.map((img, i) => ({ ...img, isCover: i === index }))
      );
    };
  
    const handleRemove = (index: number) => {
      setImages((prev) => prev.filter((_, i) => i !== index));
    };

  return (
    <div className="complaint-status-wrapper">  
      <div className={`status-badge ${value}`} onClick={toggleDropdown}>
        {STATUS_LABEL[value]} <span className="dropdown-icon">▾</span>
      </div>
      {open && (
        <div className="status-dropdown">  
          <div style={{width:"92%" , textAlign:"right", padding:"3px 5px"}} className={`status-option  `} onClick={()=>{setOpen(false)}}>
            <label>X</label>
          </div>
          {(Object.keys(STATUS_LABEL) as ComplaintStatusType[]).map((status) => (
            <div key={status} className={`status-option ${status}`} onClick={() => succesUpload(status)}>
              {STATUS_LABEL[status]}
            </div>
          ))}
        </div>
      )}
      {
        upload && <div  className="set-center" style={{background:"rgba(0,0,0,.5)",position:"fixed" , width:"100vw" , minHeight:"100vh",  zIndex: "10", overflow: "hidden", left:"0",top:"0" ,padding:"1rem"}} >
          <div style={{
            background:"#FFF" , width:"30rem",height:"fit-content",padding:"3rem", 
          }} >
            <div>
               <button onClick={()=>{setUpload(false);}} style={{width:"1rem",padding:"0"}}>X</button>
            </div>
           <div className="form-group">
            <label style={{display:"flex",alignItems:"center"}} >รูปที่อัปโหลด <sub>&nbsp; อัปโหลดรูปได้ไม่เกิน 2 MB</sub> </label>
            <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            >
            <p>ลาก & วางไฟล์ที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
              <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            </div>
             {error && <p style={{ color: "red", fontSize:"small" }}>{error}</p>}
            <div className="image-preview">
            {images.map((img, i) => (
                <div key={i} className={`image-box ${img.isCover ? 'cover' : ''}`}>
                <img src={img.preview} alt={`upload-${i}`} />
                <button type="button" onClick={() => handleSetCover(i)}>
                    {img.isCover ? '✔ รูปปก' : 'ตั้งเป็นปก'}
                </button>
                <button type="button" className="remove-btn" onClick={() => handleRemove(i)}>
                    X
                </button> 
                </div>
            ))}
            </div>
        </div>
        </div>
        </div>
      }

      
    </div>
  );
};

export default ComplaintPage;
