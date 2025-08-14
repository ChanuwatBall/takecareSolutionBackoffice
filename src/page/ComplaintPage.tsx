import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { complaintslist, updateComplaintSts } from "../action";
import "./css/Complaint.css"
import { useAlert } from "../components/AlertContext";
import {  PrintExcelComplaint } from "../components/PrintExcel";

const apiUrl = import.meta.env.VITE_API;

export interface Complaint {
  id: string;
  phone: string;
  supTitle: string;
  detail: string;
  status: 'pending' | "done" | 'in-progress' | string; // ปรับเพิ่มสถานะตามที่คุณใช้
  villager: number;
  topicId: number;
  imageIds: string[];
}
const ComplaintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [complaints, setComplaints] = useState<any[]>([ ]); 
  const [page, setPage] = useState(1); 
  const [showAlert] = useAlert();

  const PER_PAGE = 20;
  const totalPages = Math.ceil(complaints.length / PER_PAGE);
  const startIdx = (page - 1) * PER_PAGE;
  const paginated = complaints.slice(startIdx, startIdx + PER_PAGE);

    const getComplaints=async()=>{
      const complaints =  await complaintslist(id)
      console.log("complaints ", complaints)
      setComplaints(complaints)
    }

  useEffect(() => { 
    console.log("complaints id ", id)
    getComplaints()
  }, [id]);

  const updateConplaintStatus=async(complaintId:any , newstatus:any)=>{
    const form ={
      id:complaintId ,
      status:newstatus
    }
    const result = await updateComplaintSts(form)
    if(result?.result){
       getComplaints()
       showAlert('อัปเดตสถานะ สำเร็จ', 'success')
     }else{
      showAlert('อัปเดสถานะ ไม่สำเร็จ',"error")
     }
    
  }
  return (
    <div style={{ }}>
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
            <PrintExcelComplaint 
              jsonData={complaints} 
              // sheetname={"เรื่องร้องเรียน"} 
              // filename={"เรื่องร้องเรียน"}             
            />
        </div>
        <h2 style={{ marginBottom: "1.5rem" ,textAlign:"left" }}>เรื่องร้องทุกข์</h2>

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
              <tr style={{ textAlign: "left", fontWeight: 500, color: "#555" , backgroundColor:"none" }}>
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
              {paginated.map((item, index) => (
                <tr key={item.id}  >
                  <td style={{...td,...{ 
                    position:"relative",
                    textAlign:"center"  
                  }}}>
                    <div className="text-center" style={{width:"90%",height:"100%",zIndex:5,position:"absolute"}} >    
                      <label  >{String(index + 1 + startIdx).padStart(3, "0")}</label>
                    </div>
                 
                   {index == 0 && <div style={{width:"100%",height:( paginated.length+1)+"00%",  position:"absolute",top:"0",zIndex: 0,left:0,
                      boxShadow:"7px 2px 14px -8px rgba(0,0,0,0.1)",background:"#FFF" ,  }} ></div>}
                  </td>
                  <td style={{...td, ...{paddingLeft:"1.5rem"}}}>{item.phone}</td>
                  <td style={td}>{item?.supTitle}</td>
                  <td style={td}>{item.detail}</td>
                  <td style={td} className="set-center" >
                    <ButtonViewImages complaint={item} /> 
                  </td>
                  <td style={td}  > 
                    <ComplaintStatus value={item.status} 
                      update={(newsts)=>{
                        console.log("update new status ", newsts) ; 
                        updateConplaintStatus(item?.id, newsts)
                      } }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {complaints.length === 0 && <div className="set-center" style={{width:"100%", height:"15rem", }} >
            <label> ไม่พบเรื่องร้องเรียน</label>  
          </div>}

          {/* Pagination */}
           {complaints.length > 0 &&<div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1.5rem",
              fontSize: "1rem",
            }}
          >
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              style={navBtnStyle}
              className="set-center"
            >
              ◀
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={navBtnStyle}
              className="set-center"
            >
              ▶
            </button>
          </div>}

        </div>
      </div>
    </div>
  );
};

const ButtonViewImages=({complaint}:any)=>{
  const [openModal , setOpenModal] = useState(false)
  const [current , setCurrent] = useState(0)

  useEffect(()=>{
    // if(openModal){
      console.log("complaint  ", complaint)
    // }
   },[])
  return(
    <>
    <button style={viewBtnStyle} onClick={()=>{ 
          setOpenModal(true) }    
     }>ดูรูปภาพ</button>
 
          {openModal &&  <div className="modal">
            <div className="modal-content" style={{width:"70vw"}}>
              <h3 style={{margin:"0px"}} >เรื่องร้องเรียน</h3>
              <label>{complaint?.supTitle} </label> <br/>
              <div className="contetnt  " style={{display:"flex" , flexDirection:"row"}} >
                <div className="set-center" style={{width:"30%",height:"60vh",overflow:"scroll",paddingTop:"5rem"}}>
                  {
                    complaint?.imageIds.map((image:any, i:any)=> 
                    <img  key={i} 
                      src={apiUrl+`/api/file/drive-image/${image}`}  
                      alt={`complaint-images-${i}`} 
                      style={{height:"8rem",padding:".3rem"}}
                      onClick={()=>{setCurrent(i)}}
                      /> 
                    )
                  }
                </div>
                <div style={{width:"70%"}} className="set-center" >
                  <img   
                      src={apiUrl+`/api/file/drive-image/${complaint?.imageIds[current]}`}  
                      alt={`complaint-images-${current}`} 
                      style={{width:"auto" ,maxWidth:"100%", maxHeight:"50vh" }}
                      /> 
                </div>
              

              </div>
              <div className="modal-actions " style={{margin:"0px"}}>
                {/* <button type="submit" onClick={()=>{setOpenModal(false) }} >บันทึก</button> */}
                <button type="button" onClick={() =>{ setOpenModal(false)  }}>
                  ปิด
                </button>
            </div>
            </div>
          </div>}

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
  background: "#eee",
  border: "none",
  borderRadius: "12px",
  padding: "0.25rem 0.75rem",
  cursor: "pointer",
  fontSize: "smaller",
  width:"6rem"
};

const navBtnStyle: React.CSSProperties = {
  border: "none",
  background: "#eee",
  borderRadius: "50%",
  width: "36px",
  height: "36px",
  cursor: "pointer",
  color:"black"
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

  const handleSelect = (status: ComplaintStatusType) => {
    update(status);
    setOpen(false);
  };

  return (
    <div className="complaint-status-wrapper">
      <div className={`status-badge ${value}`} onClick={toggleDropdown}>
        {STATUS_LABEL[value]} <span className="dropdown-icon">▾</span>
      </div>
      {open && (
        <div className="status-dropdown">
          {(Object.keys(STATUS_LABEL) as ComplaintStatusType[]).map((status) => (
            <div
              key={status}
              className={`status-option ${status}`}
              onClick={() => handleSelect(status)}
            >
              {STATUS_LABEL[status]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



export default ComplaintPage;
