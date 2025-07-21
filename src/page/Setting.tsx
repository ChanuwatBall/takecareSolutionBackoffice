import React from 'react';
import "./css/Settings.css"

const Setting=()=>{

    return(<div className="page" >
       <div style={{ background: "#f2f2f2", padding: "2rem", minHeight: "100vh" }}>
        <div className="settings-page">
            <div className="settings-header text-left">
                <h2>ตั้งค่า</h2>
            </div>

            <div className="settings-card" onClick={()=>{ window.location.pathname = "/setting/members"}} >
                <h3 className='card-name' >เจ้าหน้าที่</h3>
                
                <p>เพิ่มและจัดการเจ้าหน้าที่ที่ใช้งานผ่านระบบ</p>
            </div>
            </div>
       </div>
    </div> 
    )
}

export default Setting;