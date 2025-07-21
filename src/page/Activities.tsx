import { useEffect, useState } from "react";
import { getActivities, updateActivityStatus } from "../action";
import "./css/Activities.css"
import Alert from "../components/Alert";
import { useAlert } from "../components/AlertContext";

const Activities=()=>{
   const [activities , setActivities] = useState<any[]>([])
   const [showAlert] = useAlert();

      const activity =async()=>{
        const res = await getActivities()
        console.log("getActivities res  ",res)
        setActivities(res)
      }

    useEffect(()=>{ 
        activity()
    },[])
 

  
  const updateStatus = async (id: number, draft: boolean, enable: boolean) => {  
    const result = await updateActivityStatus({
      id , draft ,enable
    })
    console.log("result ", result)
    if(result?.result){
       activity()
       showAlert('อัปเดตสำเร็จ', 'success')
     }else{
      showAlert('อัปเดตไม่สำเร็จ',"error")
     }
  };


    return(
     <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto",paddingTop:"2.5rem",textAlign:"left" }}>
         
      <div className="activity-page">
      <h2 className="page-title">งานกิจกรรม</h2>

      <div className="table-wrapper">
        <table className="activity-table">
          <thead>
            <tr>
              <th>รายการ</th>
              <th>กิจกรรม</th>
              <th style={{width:"15%"}}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((item, index) => {
              const current = activities.find((s) => s.id === item.id);
              return (
                <tr key={item.id}>
                  <td>{String(index + 1).padStart(3, '0')}</td>
                  <td>{item.name}</td>
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
      </div>
    )
}
export default Activities;



const StatusTag = ({ draft, enable, onUpdate }: {
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
          {(!draft || !enable) && (
            <div onClick={() => { setOpen(false); onUpdate(true, true); }}><span>แบบร่าง</span></div>
          )}
          {(draft || !enable) && (
            <div onClick={() => { setOpen(false); onUpdate(false, true); }}><span>เผยแพร่</span></div>
          )}
          {enable && (
            <div onClick={() => { setOpen(false); onUpdate(draft, false); }}><span>ปิดใช้งาน</span></div>
          )}
        </div>
      )}
    </div>
  );
};