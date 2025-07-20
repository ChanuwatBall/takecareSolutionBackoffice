import { useEffect } from "react";
import { getActivities } from "../action";

const Activities=()=>{

    useEffect(()=>{ 
        const activity =async()=>{
            const res = await getActivities()
            console.log("getActivities res  ",res)
        }
        activity()
    },[])
    return(
     <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto",paddingTop:"2.5rem",textAlign:"left" }}>
        </div>
      </div>
    )
}
export default Activities;