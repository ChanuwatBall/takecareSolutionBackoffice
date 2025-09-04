import { useEffect, useState } from "react";
import { deleteActivity, getActivities, updateActivityStatus } from "../action";
import "./css/Activities.css"
import { useAlert } from "../components/AlertContext";
import { PrintExcelActivity } from "../components/PrintExcel";
import { LazyLoadImage } from 'react-lazy-load-image-component';

const apiUrl = import.meta.env.VITE_API;

const Activities = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [showAlert] = useAlert();

  // --- Pagination state (NEW) ---
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 5/10/20/50

  const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);
  const goToPage = (p: number, totalPages: number) => setPage(clamp(p, 1, totalPages));

  const activity = async () => {
    const res = await getActivities();
    setActivities(res || []);
  };

  useEffect(() => {
    activity();
  }, []);

  const updateStatus = async (id: number, draft: boolean, enable: boolean) => {
    const result = await updateActivityStatus({ id, draft, enable });
    if (result?.result) {
      await activity();
      showAlert('อัปเดตสำเร็จ', 'success');
    } else {
      showAlert('อัปเดตไม่สำเร็จ', "error");
    }
  };

  const deleteAct = async (act: any) => {
    setLoading(true);
    const result: any = await deleteActivity(act);
    if (result?.result) {
      await activity();
      showAlert('ลบสำเร็จ', 'success');
    } else {
      showAlert('ลบไม่สำเร็จ', "error");
    }
    setLoading(false);
  };

  // --- Pagination calculations (NEW) ---
  const total = activities.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    // ถ้าลบรายการจนหน้าปัจจุบันเกิน ให้ปรับกลับเข้าช่วงอัตโนมัติ
    setPage((p) => clamp(p, 1, totalPages));
  }, [totalPages, pageSize, activities]);

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageItems = activities.slice(startIndex, endIndex);

  // --- Pagination UI (NEW) ---
  const pgBtn = (disabled: boolean): React.CSSProperties => ({
    padding: "0.35rem 0.6rem",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: disabled ? "#f5f5f5" : "#fff",
    color: disabled ? "#aaa" : "#333",
    cursor: disabled ? "not-allowed" : "pointer",
  });
  const PaginationBar = () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center", justifyContent: "space-between", margin: "0.75rem 0"  , fontSize:"small" }}>
      <div style={{ color: "#555", fontSize: 14 }}>
        แสดง {total === 0 ? 0 : startIndex + 1}-{endIndex} จาก {total} รายการ
      </div>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <label style={{ color: "#555", fontSize: 14 }}>ต่อหน้า:</label>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
          style={{ padding: "0.3rem 0.5rem", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={() => goToPage(1, totalPages)} disabled={page === 1} style={pgBtn(page === 1)}>« หน้าแรก</button>
          <button onClick={() => goToPage(page - 1, totalPages)} disabled={page === 1} style={pgBtn(page === 1)}>‹ ก่อนหน้า </button>
          <span style={{ color: "#555", minWidth: 90, textAlign: "center" }}>หน้า {page}/{totalPages}</span>
          <button onClick={() => goToPage(page + 1, totalPages)} disabled={page === totalPages} style={pgBtn(page === totalPages)}>ถัดไป ›</button>
          <button onClick={() => goToPage(totalPages, totalPages)} disabled={page === totalPages} style={pgBtn(page === totalPages)}>สุดท้าย »</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto",  textAlign: "left" }}>
        <div className="set-center" style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <PrintExcelActivity jsonData={activities} />
        </div>

        <div className="activity-page">
          <h2 className="page-title">งานกิจกรรม</h2>

          {/* TOP pagination (NEW) */}
          <PaginationBar />

          <div className="table-wrapper">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>รายการ</th>
                  <th>กิจกรรม</th>
                  <th style={{ width: "15%" }}>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: "1rem", color: "#777" }}>
                      ไม่พบรายการ
                    </td>
                  </tr>
                ) : (
                  pageItems.map((item, index) => {
                    const current = activities.find((s) => s.id === item.id);
                    const displayIndex = startIndex + index + 1; // ลำดับต่อเนื่องข้ามหน้า
                    return (
                      <tr key={item.id}>
                        <td>{String(displayIndex).padStart(3, '0')}</td>
                        <td>
                          <button
                            className="link-btn"
                            style={{ color: "black", background: "none", padding: "0px", fontWeight: 400 }}
                            onClick={() => setSelected(item)}
                          >
                            {item.name ? item.name : "-"}
                          </button>
                        </td>
                        <td>
                          {current && (
                            <StatusTag
                              draft={current.draft}
                              enable={current.enable}
                              onUpdate={(draft, enable) => updateStatus(item.id, draft, enable)}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* BOTTOM pagination (NEW) */}
          {/* <PaginationBar /> */}
        </div>
      </div>

      {selected && (
        <div className="modal">
          <div className="modal-content" style={{ width: "80vw" }}>
            <h3>{selected.name}</h3>
            <LazyLoadImage
              src={apiUrl + "/api/file/drive-image/" + selected.coverImagePath}
              alt="cover"
              style={{ width: '100%', maxHeight: 200, objectFit: 'cover', marginBottom: 10 }}
            />
            <p><strong>ชื่อย่อ:</strong> {selected.shortName}</p>
            <p><strong>รายละเอียด:</strong> {selected.description}</p>
            <p><strong>วันที่จัด:</strong> {selected.startDate} - {selected.endDate}</p>
            <p className="set-center" style={{ flexDirection: "row" }}>
              <strong>สถานะ:</strong>&nbsp;
              <StatusTag
                draft={selected.draft}
                enable={selected.enable}
                onUpdate={(draft, enable) => updateStatus(selected.id, draft, enable)}
              />
              &nbsp;
              <button style={{ background: "none", padding: "3px" }} onClick={() => { deleteAct(selected); setSelected(null) }}>
                <span style={{ color: "red" }}>ลบ</span>
              </button>
              &nbsp;{loading && <div className="spinner"></div>}
            </p>
            <div className="image-gallery">
              {selected.imagePaths.map((id: string, i: number) => (
                <LazyLoadImage
                  key={i}
                  src={`${apiUrl}/api/file/drive-image/${id}`}
                  alt={`img-${i}`}
                  style={{ width: 100, height: 80, objectFit: 'cover', margin: 4 }}
                />
              ))}
            </div>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <button onClick={() => setSelected(null)} className="btn">ปิด</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default Activities;

const StatusTag = ({
  draft,
  enable,
  onUpdate
}: {
  draft: boolean;
  enable: boolean;
  onUpdate: (draft: boolean, enable: boolean) => void;
}) => {
  const [open, setOpen] = useState(false);

  const getLabel = () => {
    if (!enable) return 'ปิดใช้งาน';
    return draft ? 'ยังไม่เผยแพร่' : 'เผยแพร่แล้ว';
  };

  const getClass = () => {
    if (!enable) return 'disabled';
    return draft ? 'draft' : 'published';
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className={`status-tag ${getClass()}`} onClick={() => setOpen(!open)}>
        {getLabel()}
      </div>
      {open && (
        <div className="status-dropdown">
          <button onClick={() => { setOpen(false) }}>x</button>
          {(!draft || !enable) && (
            <div onClick={() => { setOpen(false); onUpdate(true, true); }}>
              <span>แบบร่าง</span>
            </div>
          )}
          {(draft || !enable) && (
            <div onClick={() => { setOpen(false); onUpdate(false, true); }}>
              <span>เผยแพร่</span>
            </div>
          )}
          {enable && (
            <div onClick={() => { setOpen(false); onUpdate(draft, false); }}>
              <span>ปิดใช้งาน</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
