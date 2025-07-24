import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface ComplaintItem {
  id: string;
  phone: string;
  topic: string;
  detail: string;
  status: "pending" | "done";
}

const ComplaintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [complaints, setComplaints] = useState<ComplaintItem[]>([
  {
    "id": "001",
    "phone": "0987654321",
    "topic": "ถนนชำรุด / เป็นหลุมเป็นบ่อ",
    "detail": "พื้นถนน แตก ร้าว",
    "status": "pending"
  },
  {
    "id": "002",
    "phone": "0987654333",
    "topic": "ไม่มีทางเท้า / ทางเท้าชำรุด",
    "detail": "ทางเท้าพัง มีเศษวัสดุ อิฐหลุด",
    "status": "done"
  }
]);
  const [page, setPage] = useState(1);

  const PER_PAGE = 20;
  const totalPages = Math.ceil(complaints.length / PER_PAGE);
  const startIdx = (page - 1) * PER_PAGE;
  const paginated = complaints.slice(startIdx, startIdx + PER_PAGE);

  useEffect(() => {
    // Mock API fetch by complaint ID
    fetch(`/api/complaint/${id}/items`)
      .then((res) => res.json())
      .then(setComplaints);
  }, [id]);

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="set-center" style={{flexDirection:"row" , justifyContent:"flex-end",marginBottom:"2rem"}} >
            <button style={{
                width:"fit-content" ,
                padding:".5rem",
                background:"#FFF",
                fontSize:"small"
            }} > 
                ส่งออกเป็นไฟล์  &nbsp;
                <img src="../icons/ionicons/chevron-down-outline.svg" style={{width:".8rem"}} /> 
            </button>
        </div>
        <h2 style={{ marginBottom: "1.5rem" ,textAlign:"left" }}>เรื่องร้องทุกข์</h2>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
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
                  <td style={td}>{item.topic}</td>
                  <td style={td}>{item.detail}</td>
                  <td style={td} className="set-center">
                    <button style={viewBtnStyle}>ดูรูปภาพ</button>
                  </td>
                  <td style={td}  >
                    <span
                      className="set-center"
                      style={{
                        flexDirection:"row",
                        justifyContent:"flex-start",
                        padding: "0.25rem 0.75rem",
                        minWidth:"5.8rem" ,
                        width:"fit-content",
                        borderRadius: "999px",
                        background:
                          item.status === "pending" ? "#F5EDD0" : "#C9F7DD",
                        color: item.status === "pending" ? "#9E6300" : "#5FB088",
                        fontWeight: 500,
                        fontSize: "smaller",
                      }}
                    >
                      {item.status === "pending" ? "กำลังดำเนินการ" : "เสร็จเรียบร้อย"} &nbsp;
                      <img src="../icons/ionicons/chevron-expand-outline.svg" style={{width:".8rem"}} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div
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
          </div>
        </div>
      </div>
    </div>
  );
};

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
};

export default ComplaintPage;
