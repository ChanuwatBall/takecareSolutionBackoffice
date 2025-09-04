import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { complaintslist, updateComplaintSts } from "../action";
import "./css/Complaint.css"
import { useAlert } from "../components/AlertContext";
import { PrintExcelComplaint } from "../components/PrintExcel";

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
    <div style={{display:"flex", gap:"1rem", alignItems:"center", justifyContent:"space-between", margin:"0.75rem 0" , fontSize:"small"}}>
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
  const handleSelect = (status: ComplaintStatusType) => { update(status); setOpen(false); };

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
            <div key={status} className={`status-option ${status}`} onClick={() => handleSelect(status)}>
              {STATUS_LABEL[status]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintPage;
