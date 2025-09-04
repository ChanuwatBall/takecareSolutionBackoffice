import { useEffect, useMemo, useState } from "react";

interface Member {
  id: string;
  username: string;
  phone: string;
  fullName: string;
  birthdate: string; // ISO date string
  email?: string;
  gender?: string;
}

const MemberTable = () => {
  const [members] = useState<Member[]>([]);
  const [search] = useState("");

  // --- Pagination state ---
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // ปรับได้: 5, 10, 20, 50

  // --- Filter (แก้ฟิลด์ให้ตรงกับ interface ที่คุณใช้) ---
  const filteredMembers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return members;
    return members.filter((m) =>
      `${m.username} ${m.fullName} ${m.phone}`.toLowerCase().includes(q)
    );
  }, [members, search]);

  // --- Recalculate pagination when data changes ---
  const total = filteredMembers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    // เมื่อผลลัพธ์/จำนวนต่อหน้าเปลี่ยน ให้เคาะหน้าให้อยู่ในช่วงที่ถูกต้อง
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages, pageSize, filteredMembers]);

  // --- Slice current page ---
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageItems = filteredMembers.slice(startIndex, endIndex);

  // --- Helpers ---
  const clamp = (n: number, min: number, max: number) =>
    Math.min(Math.max(n, min), max);

  const goToPage = (p: number) => setPage(clamp(p, 1, totalPages));

  const calculateAge = (birthdate: string) => {
    const dob = new Date(birthdate);
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const mdiff =
      now.getMonth() - dob.getMonth() ||
      (now.getDate() >= dob.getDate() ? 0 : -1);
    if (mdiff < 0) age -= 1;
    return age;
  };

  return (
    <div className="moo-page">
      <div style={{ background: "#f2f2f2", padding: "2rem", minHeight: "100vh" }}>
        {/* Pagination header */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}
        >
          <div style={{ color: "#555", fontSize: 14 }}>
            แสดง {total === 0 ? 0 : startIndex + 1}-{endIndex} จากทั้งหมด {total} รายการ
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <label style={{ color: "#555", fontSize: 14 }}>ต่อหน้า:</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
              style={{
                padding: "0.4rem 0.6rem",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "#fff",
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button
                onClick={() => goToPage(1)}
                disabled={page === 1}
                style={btnStyle(page === 1)}
                aria-label="First page"
              >
                « หน้าแรก
              </button>
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                style={btnStyle(page === 1)}
                aria-label="Previous page"
              >
                ‹ ก่อนหน้า
              </button>

              <span style={{ color: "#555", minWidth: 90, textAlign: "center" }}>
                หน้า {page}/{totalPages}
              </span>

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                style={btnStyle(page === totalPages)}
                aria-label="Next page"
              >
                ถัดไป ›
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={page === totalPages}
                style={btnStyle(page === totalPages)}
                aria-label="Last page"
              >
                สุดท้าย »
              </button>
            </div>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
          <thead style={{ color: "#555", fontWeight: 500, borderBottom: "1px solid #E0E0E0" }}>
            <tr>
              <th style={thStyle}>User Name</th>
              <th style={thStyle}>หมายเลขโทรศัพท์</th>
              <th style={thStyle}>ชื่อ-นามสกุล</th>
              <th style={thStyle}>วันเกิด</th>
              <th style={thStyle}>อายุ</th>
              <th style={thStyle}>อีเมลล์</th>
              <th style={thStyle}>เพศ</th>
              <th
                style={{
                  ...thStyle,
                  borderLeft: "1px solid rgb(235, 235, 235)",
                  boxShadow: " -18px -5px 15px -22px rgba(0,0,0,0.3)",
                }}
              ></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ ...tdStyle, textAlign: "center", color: "#777" }}>
                  ไม่พบรายการ
                </td>
              </tr>
            ) : (
              pageItems.map((m) => (
                <tr key={m.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>{m.username}</td>
                  <td style={tdStyle}>{m.phone}</td>
                  <td style={tdStyle}>{m.fullName}</td>
                  <td style={tdStyle}>{new Date(m.birthdate).toLocaleDateString("th-TH")}</td>
                  <td style={tdStyle}>{calculateAge(m.birthdate)}</td>
                  <td style={tdStyle}>{m.email || "-"}</td>
                  <td style={tdStyle}>{m.gender || "-"}</td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "left",
                      borderLeft: "1px solid rgb(235, 235, 235)",
                      boxShadow: " -18px -5px 15px -22px rgba(0,0,0,0.3)",
                    }}
                  >
                    <button
                      style={{
                        border: "none",
                        background: "none",
                        color: "#444",
                        cursor: "pointer",
                      }}
                      onClick={() => alert(`ดู/แก้ไข ID: ${m.id}`)}
                    >
                      👁 ดู & แก้ไข
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination footer (ซ้ำด้านล่างเพื่อความสะดวก) */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "flex-end",
            marginTop: "0.75rem",
          }}
        >
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              onClick={() => goToPage(1)}
              disabled={page === 1}
              style={btnStyle(page === 1)}
            >
              « First
            </button>
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              style={btnStyle(page === 1)}
            >
              ‹ Prev
            </button>
            <span style={{ color: "#555", minWidth: 90, textAlign: "center" }}>
              หน้า {page}/{totalPages}
            </span>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              style={btnStyle(page === totalPages)}
            >
              Next ›
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={page === totalPages}
              style={btnStyle(page === totalPages)}
            >
              Last »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberTable;

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "0.75rem",
  fontSize: "0.95rem",
};

const tdStyle: React.CSSProperties = {
  padding: "0.75rem",
  fontSize: "0.95rem",
  color: "#333",
};

const btnStyle = (disabled: boolean): React.CSSProperties => ({
  padding: "0.4rem 0.6rem",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: disabled ? "#f5f5f5" : "#fff",
  color: disabled ? "#aaa" : "#333",
  cursor: disabled ? "not-allowed" : "pointer",
});
