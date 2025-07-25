import { useEffect, useState } from 'react';
import "./css/Settings.css"
import { getCookie } from '../action';


interface User{
     id : number
     name : string
     username :string
     password : string | any
     email : string
     phoneNumber : string
     allowedTopicIds : string[ ] 
     companyId :number
     role : string
     token : string
}


const Setting=()=>{
   const [user , setUser] = useState<User | any>(null)
    useEffect(()=>{

        const usercookie=async()=>{
            const userCookie = await getCookie("user_info")
            setUser(userCookie)
        }
        usercookie()
    },[])

    return(<div className="page" >
       <div style={{ background: "#f2f2f2", padding: "2rem", minHeight: "100vh" }}>
        <div className="settings-page">
            <div className="settings-header text-left">
                <h2>ตั้งค่า</h2>
            </div>

            {user?.role.match("admin") &&
            <div className="settings-card" onClick={()=>{ window.location.pathname = "/setting/members"}} >
                <h3 className='card-name' >เจ้าหน้าที่</h3>
                
                <p>เพิ่มและจัดการเจ้าหน้าที่ที่ใช้งานผ่านระบบ</p>
            </div> }
            </div>
       </div>
    </div> 
    )
}

export default Setting;