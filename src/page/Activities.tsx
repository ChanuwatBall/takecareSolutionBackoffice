import { useEffect, useState } from "react";
import { deleteActivity, getActivities, updateActivityStatus } from "../action";
import "./css/Activities.css"
import { useAlert } from "../components/AlertContext";
import { PrintExcelActivity } from "../components/PrintExcel";
import { LazyLoadImage } from 'react-lazy-load-image-component';

const apiUrl = import.meta.env.VITE_API;

const Activities = () => {
  const [activities, setActivities] = useState<any[]>([])
  const [loading ,setLoading ] = useState(false) 
  const [showAlert] = useAlert();

  const [selected, setSelected] = useState<any | null>(null);

  const activity = async () => {
    const res = await getActivities()
    console.log("getActivities res  ", res)
    setActivities(res)
  }

  useEffect(() => {
    activity()
  }, [])



  const updateStatus = async (id: number, draft: boolean, enable: boolean) => {
    const result = await updateActivityStatus({
      id, draft, enable
    })
    console.log("result ", result)
    if (result?.result) {
      activity()
      showAlert('อัปเดตสำเร็จ', 'success')
    } else {
      showAlert('อัปเดตไม่สำเร็จ', "error")
    }
  };

  const deleteAct=async(act:any)=>{
    console.log(" deleteActivity ",act) 
    setLoading(true)
    const result:any = await  deleteActivity(act)
    if(result?.result){ 
      activity()
      showAlert('ลบสำเร็จ', 'success')
    }else{ 
      showAlert('ลบไม่สำเร็จ', "error")
    }
    setLoading(false)
  }


  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", paddingTop: "2.5rem", textAlign: "left" }}>
        <div className="set-center" style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: "ๅrem" }} >
          <PrintExcelActivity
            jsonData={activities}
          />
        </div>
        <div className="activity-page">
          <h2 className="page-title">งานกิจกรรม</h2>

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
                {activities.map((item, index) => {
                  const current = activities.find((s) => s.id === item.id);
                  return (
                    <tr key={item.id}>
                      <td>{String(index + 1).padStart(3, '0')}</td>
                      <td>
                        <button className="link-btn" style={{ color: "black", background: "none", padding: "0px", fontWeight: "400" }} onClick={() => setSelected(item)}>
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>


      {selected && (
        <div className="modal">
          <div className="modal-content" style={{ width: "80vw" }}>
            <h3>{selected.name}</h3>
            <LazyLoadImage src={apiUrl + "/api/file/drive-image/" + selected.coverImagePath} alt="cover" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', marginBottom: 10 }} />
            <p><strong>ชื่อย่อ:</strong> {selected.shortName}</p>
            <p><strong>รายละเอียด:</strong> {selected.description}</p>
            <p><strong>วันที่จัด:</strong> {selected.startDate} - {selected.endDate}</p>
            <p className="set-center" style={{ flexDirection: "row" }} ><strong>สถานะ:</strong>
              {/* {selected.draft ? 'แบบร่าง' : 'เผยแพร่'} | {selected.enable ? 'ใช้งาน' : 'ปิดใช้งาน'} */}
              &nbsp;
              <StatusTag
                draft={selected.draft}
                enable={selected.enable}
                onUpdate={(draft, enable) => updateStatus(selected.id, draft, enable)} 
              /> &nbsp;
               <button  style={{background:"none", padding:"3px"}} onClick={() => { deleteAct(selected); setSelected(null)}}><span style={{color:"red"}}>ลบ</span></button> 
               &nbsp;{loading && <div className="spinner"></div>} 
            </p>
            <div className="image-gallery">
              {selected.imagePaths.map((id: string, i: number) => (
                <LazyLoadImage key={i} src={`${apiUrl}/api/file/drive-image/${id}`} alt={`img-${i}`} style={{ width: 100, height: 80, objectFit: 'cover', margin: 4 }} />
              ))}
            </div>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <button onClick={() => setSelected(null)} className="btn">ปิด</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
export default Activities;



const StatusTag = ({ draft, enable, onUpdate  }: {
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
          <button onClick={() => { setOpen(false) }} >x</button>
          {(!draft || !enable) && (
            <div onClick={() => { setOpen(false); onUpdate(true, true); }}><span>แบบร่าง</span></div>
          )}
          {(draft || !enable) && (
            <div onClick={() => { setOpen(false); onUpdate(false, true); }}><span>เผยแพร่</span></div>
          )}
          {enable && (
            <div onClick={() => { setOpen(false); onUpdate(draft, false); }}><span>ปิดใช้งาน</span></div>
          )}
          {/* <hr />
           <div onClick={() => { setOpen(false); onDelete( ); }}><span style={{color:"red"}}>ลบ</span></div> */}
        </div>
      )}
    </div>
  );
};