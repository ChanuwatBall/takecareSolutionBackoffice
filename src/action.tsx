import axios from "axios"; 
const apiUrl = import.meta.env.VITE_API;
const token = import.meta.env.VITE_TOKEN;

const api = axios.create({
    baseURL: apiUrl  ,
    headers: {
        Authorization: "Bearer "+token
    }, 
})

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

export default {}