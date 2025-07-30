import axios from "axios"; 
const apiUrl = import.meta.env.VITE_API;
const token = import.meta.env.VITE_TOKEN;

const api = axios.create({
    baseURL: apiUrl+"/api/backoffice"  ,
    headers: {
        Authorization: "Bearer "+token ,
        // 'Content-Type': 'application/json',
    }, 
})

export function encodeBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
} 
export function decodeBase64(base64: string): string {
  return decodeURIComponent(escape(atob(base64)));
}

export const getDefaultCompay=async()=>{
        console.log("apiUrl   ",apiUrl)
        console.log("token   ",token)

    return await api.get("company").then((res)=>{
        console.log("getDefaultCompay res ",res)
        return res.data
    }).catch((err)=>{
        console.log("getDefaultCompay err ",err)
        return null
    })
}

export async function login ({  username ,  password , company }:any){
  try {
    const token = encodeBase64(username +":"+  password)
    const response = await api.post( "login" , {}, { 
      headers: {
        company ,
        Token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return null
  }
  
}

export async function getSubdistrict() {
    try {
    const token = await getCookie("auth_token")
    console.log("token ",token)
    const response = await api.post( "subdistrict" , {}, { 
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return []
  }
}
export async function getMemberdetail() {
    try {
    const token = await getCookie("auth_token") 
    console.log("token ",token)
    const response = await api.post( "memberdetail" , {}, { 
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return null
  }
}

export async function getMembers() {
    try {
    const token = await getCookie("auth_token") 
    console.log("token ",token)
    const response = await api.post( "members" , {}, { 
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return null
  }
}
export async function addMember(body:any) {
    try {
    const token = await getCookie("auth_token") 
    console.log("token ",token)
    const response = await api.post( "member/add" , body , { 
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return null
  }
} 
// /member/upload
export async function uploadMember(body:any) {
    try {
    const token = await getCookie("auth_token") 
    console.log("token ",token)
    const response = await api.post( "member/upload" , body , { 
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return null
  }
} 


export async function deleteMember(body:any) {
    try {
    const token = await getCookie("auth_token") 
    console.log("token ",token)
    const response = await api.post( "member/delete" , body , { 
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return null
  }
} 

 
export async function getVillagersByVillage({id}:any) {
    try {
    const token = await getCookie("auth_token")
    console.log("token ",token)
    const response = await api.post( "villager/list" , {id:id}, { 
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return null
  }
}

///complaints/list
export async function complaintslist(topic:any) {
 try {
    const token = await getCookie("auth_token")
    console.log("token ",token)
    const response = await api.post( "complaints/list" , {} , { 
      params:{  
        topic: topic
      },
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return {result: false , description: error?.message}
  }
}

export async function dashboardMemberStats(month:any) {
 try {
    const token = await getCookie("auth_token")
    console.log("token ",token)
    const response = await api.post( "dashboard/memberstats" , {} , { 
      params:{  
        month: month
      },
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return {result: false , description: error?.message}
  }
}

///dashboard/complaintsumm
export async function dashboardCoplaintSummary(month:any) {
 try {
    const token = await getCookie("auth_token")
    console.log("token ",token)
    const response = await api.post( "dashboard/complaintsumm" , {} , { 
       params:{  
        month: month
      },
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return {result: false , description: error?.message}
  }
}

///dashboard/members
export async function dashboardMembers() {
 try {
    const token = await getCookie("auth_token")
    console.log("token ",token)
    const response = await api.post( "dashboard/members" , {} , { 
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return {result: false , description: error?.message}
  }
}

export async function updateComplaintSts(complaint:any) {
 try {
    const token = await getCookie("auth_token")
    console.log("token ",token)
    const response = await api.post( "complaint/updatestatus" , complaint, {  
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return {result: false , description: error?.message}
  }
}


///villager/update"
export async function updateVillager(body:any) {
 try {
    const token = await getCookie("auth_token")
    console.log("token ",token)
    const response = await api.post( "villager/update" , body , { 
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return {result: false , description: error?.message}
  }
}

export async function createActivity(formData:any) {
    try {
    const token = await getCookie("auth_token")
    console.log("token ",token)
    const response = await api.post( "activity/create" ,formData, { 
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return null
  }
}
///activity/create

/// 
export async function getActivities() {
    try {
    const token = await getCookie("auth_token")
    console.log("token ",token)
    const response = await api.get( "activities" , { 
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return null
  }
}
export async function updateActivityStatus(body:any) {
    try {
    const token = await getCookie("auth_token")
    console.log("token ",token)
    const response = await api.post( "activity/updatestatus",body , { 
      headers: { 
        token: "Basic "+token
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('POST failed:', error.message);
    return null
  }
}

//deleteMember
 

export async function setCookie(name: string, value: any, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${JSON.stringify(value)};${expires};path=/`;
}

export async function getCookie(name: string)  {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const parse:any = parts.pop()?.split(';').shift() || null;
    return JSON.parse(parse)
  }
  return null;
}
export async function deleteCookie(name:string) {
  document.cookie = name + '=; Max-Age=0; path=/';
}

export default {}