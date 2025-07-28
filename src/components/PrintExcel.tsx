import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs'; 
import { useState } from 'react';
import "./css/PrintExcel.css" 
import axios from 'axios';
import fs from "fs"

const apiUrl = import.meta.env.VITE_API;
 
interface PrintExcelProps{
    jsonData: any[] 
    sheetname: string
    filename:string
}
export const PrintExcel = ({jsonData,sheetname,filename}:PrintExcelProps) => {
   const [loading,setLoading] = useState(false)
 
  function exportToExcel(){
    setLoading(true); // ฟังก์ชันที่สร้างไฟล์ Excel
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetname );

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, filename+".xlsx");
    setLoading(false)

  }

  return( <div className='set-center' style={{flexDirection:"row",justifyContent:"center",alignItems:"flex-start"}}> {loading}
   
    <button  
        disabled={loading}
        style={{
            width:"fit-content" ,
            padding:".5rem",
            background:"#FFF",
            fontSize:"small"
        }} 
         onClick={exportToExcel}> 
         {loading && <div className="spinner"></div>} &nbsp;
            {loading ? "กำลังสร้างไฟล์"  :"ส่งออกเป็นไฟล์" }    &nbsp;
            <img src="../icons/ionicons/chevron-down-outline.svg" style={{width:".8rem"}} /> 
    </button>
    </div>
  )
};

 
export const PrintExcelActivity = ({jsonData}:any ) => {
   const [loading,setLoading] = useState(false)
    
  async function exportToExcel(){
    
      setLoading(true); // ฟังก์ชันที่สร้างไฟล์ Excel
  
      const data = jsonData 

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("กิจกรรม");

      sheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "ชื่อกิจกรรม", key: "name", width: 30 },
        { header: "วันที่เริ่ม", key: "startDate", width: 15 },
        { header: "วันที่สิ้นสุด", key: "endDate", width: 15 },
        { header: "เปิดใช้งาน", key: "enable", width: 15 },
        { header: "รูปภาพ", key: "images", width: 20 },
      ];


      for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
        const activity = data[rowIndex];

        // Add row
        const row = sheet.addRow({
          id: activity.id,
          name: activity.name,
          startDate: activity.startDate,
          endDate: activity.endDate,
          enable: activity.enable ? "✅" : "❌"
        });


        const rowHeight = 80; 
        sheet.getRow(row.number).height = rowHeight;

        // ปรับความกว้างของคอลัมน์ภาพ (index = 6 -> "F")
        sheet.getColumn(6).width = 20; 
        // Download และแทรกรูปภาพ 1 รูป (จาก Google Drive URL)
        const imageUrl = `${apiUrl}/api/file/drive-image/${activity.imagePaths[0]}`;
        const res = await fetch(imageUrl) 
        const blob = await res.blob();
        const buffer = await blob.arrayBuffer();

        const imageId = workbook.addImage({
          buffer,
          extension: 'jpeg'
        });

       sheet.addImage(imageId, {
          tl: { col: 5, row: rowIndex + 1 }, // คอลัมน์ F = index 5 (เริ่มนับจาก 0)
          ext: { width: 120, height: 80 }  
        });
      }

      // สร้างไฟล์ Excel
      const excelBuffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "กิจกรรมพร้อมรูป.xlsx");
   
      setLoading(false);
  };

  return( <div className='set-center' style={{flexDirection:"row",justifyContent:"center",alignItems:"flex-start"}}> {loading}
      {loading && <div className="spinner"></div>} &nbsp;
    <button 
        disabled={loading}
        style={{
            width:"fit-content" ,
            padding:".5rem",
            background:"#FFF",
            fontSize:"small"
        }} 
         onClick={exportToExcel}>  
             {loading ? "กำลังสร้างไฟล์"  :"ส่งออกเป็นไฟล์" }    &nbsp;
            <img src="../icons/ionicons/chevron-down-outline.svg" style={{width:".8rem"}} /> 
    </button>

    </div>
  )
};



export const PrintExcelComplaint= ({jsonData}:any ) => {
   const [loading,setLoading] = useState(false)
    
  async function exportToExcel(){
    
      setLoading(true); // ฟังก์ชันที่สร้างไฟล์ Excel
  
      const data = jsonData 
      console.log("data ",data)

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("ร้องเรียน"); 

      sheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "หมายเลขโทรศัพท์", key: "name", width: 30 },
        { header: "หัวข้อย่อย", key: "startDate", width: 15 },
        { header: "สถานะ", key: "endDate", width: 15 },
        { header: "หมู่", key: "enable", width: 15 },
        // { header: "หัวข้อ", key: "images", width: 20 },
      ];

 
      for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
        const complaint = data[rowIndex];

        // Add row
        const row = sheet.addRow([
           complaint.id,
          complaint.phone,
           complaint.supTitle,
           complaint.status,
           complaint.villager  , 
        ]);


        const rowHeight = 80; 
        sheet.getRow(row.number).height = rowHeight;

        // ปรับความกว้างของคอลัมน์ภาพ (index = 6 -> "F")
        sheet.getColumn(6).width = 20; 
        // Download และแทรกรูปภาพ 1 รูป (จาก Google Drive URL)
        const imageUrl = `${apiUrl}/api/file/drive-image/${complaint.imageIds[0]}`;
        const res = await fetch(imageUrl) 
        const blob = await res.blob();
        const buffer = await blob.arrayBuffer();

        const imageId = workbook.addImage({
          buffer,
          extension: 'jpeg'
        });

       sheet.addImage(imageId, {
          tl: { col: 5, row: rowIndex + 1 }, // คอลัมน์ F = index 5 (เริ่มนับจาก 0)
          ext: { width: 120, height: 80 }  
        });
      }

        // สร้างไฟล์ Excel
        const excelBuffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, "กิจกรรมพร้อมรูป.xlsx");
   
      setLoading(false);
    };


 

  return( <div className='set-center' style={{flexDirection:"row",justifyContent:"center",alignItems:"flex-start"}}> {loading}
      {loading && <div className="spinner"></div>} &nbsp;
    <button 
        disabled={loading}
        style={{
            width:"fit-content" ,
            padding:".5rem",
            background:"#FFF",
            fontSize:"small"
        }} 
         onClick={exportToExcel}>  
             {loading ? "กำลังสร้างไฟล์"  :"ส่งออกเป็นไฟล์" }    &nbsp;
            <img src="../icons/ionicons/chevron-down-outline.svg" style={{width:".8rem"}} /> 
    </button>

    </div>
  )
};
 

export default {}


