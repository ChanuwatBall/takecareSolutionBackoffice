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
        <h2 style={{ marginBottom: "1.5rem" }}>เรื่องร้องทุกข์</h2>

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
              <tr style={{ textAlign: "left", fontWeight: 500, color: "#555" }}>
                <th style={th}>รายการ</th>
                <th style={th}>หมายเลขโทรศัพท์</th>
                <th style={th}>หัวข้อเรื่องย่อย</th>
                <th style={th}>รายละเอียด</th>
                <th style={th}>ดูรูปภาพ</th>
                <th style={th}>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={td}>{String(index + 1 + startIdx).padStart(3, "0")}</td>
                  <td style={td}>{item.phone}</td>
                  <td style={td}>{item.topic}</td>
                  <td style={td}>{item.detail}</td>
                  <td style={td}>
                    <button style={viewBtnStyle}>ดูรูปภาพ</button>
                  </td>
                  <td style={td}>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "999px",
                        background:
                          item.status === "pending" ? "#fce7a2" : "#bdf3cc",
                        color: "#333",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                      }}
                    >
                      {item.status === "pending" ? "กำลังดำเนินการ" : "เสร็จเรียบร้อย"}
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
};

const td: React.CSSProperties = {
  padding: "0.75rem",
  fontSize: "0.95rem",
  color: "#333",
};

const viewBtnStyle: React.CSSProperties = {
  background: "#eee",
  border: "none",
  borderRadius: "12px",
  padding: "0.4rem 1rem",
  cursor: "pointer",
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
