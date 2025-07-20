import axios from "axios"; 
const apiUrl = import.meta.env.VITE_API;
const token = import.meta.env.VITE_TOKEN;

const api = axios.create({
    baseURL: apiUrl  ,
    headers: {
        Authorization: "Bearer "+token ,
        'Content-Type': 'application/json',
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
    return null
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


export default {}