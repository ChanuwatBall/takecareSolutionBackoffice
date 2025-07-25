import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import "./css/ActivityForm.css"
import { createActivity  } from '../action';
import { useAlert } from '../components/AlertContext';

type ImageData = {
  file: File;
  preview: string;
  isCover: boolean;
};

export default function ActivityForm() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const [activityName , setActivityName] = useState("")
  const [activityShortname , setActivityShortName] = useState("")
  const [start,setStart] = useState("")
  const [end , setEnd] = useState("")
  const [place , setPlace] = useState("")
  const [termsCondition , setTermsCondition] = useState("")
  const [showAlert] = useAlert();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  

//   const [imgs, setImages] = useState([]/)

useEffect(()=>{
})

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages: ImageData[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isCover: false,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleSetCover = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isCover: i === index }))
    );
  };

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const savePublish=async()=>{ 
    const formData = new FormData();
    
    await  images.forEach((img ) => {
        formData.append('images', img.file);
        if (img.isCover) {  
            formData.append(`coverImage`,  img.file );
        } 
    });

   formData.append('activityName',activityName);
   formData.append('activityShortname',activityShortname);
   formData.append('start',start);
   formData.append('end',end);
   formData.append('place',place);
   formData.append('termsCondition',termsCondition);


   for (const [key, value] of formData.entries()) {
    console.log(key , " = ", value);
    } 
    const result = await createActivity(formData);
    console.log("result ",result)
   if(result?.result){ 
       showAlert('เพิ่มกิจกรรมสำเร็จ', 'success') 
     }else{
      showAlert('เพิ่มกิจกรรมไม่สำเร็จ',"error")
     }
  }

  return ( 
    <div className='page' style={{overflowY:"scroll"}} >
      <div style={{ maxWidth: "1200px", margin: "0 auto",paddingTop:"2.5rem",textAlign:"left"}}>
        <div  className="activity-form" style={{background:"none",padding:"none"}}>
           <label   > งานกิจกรรม</label>
        </div>
       
        <div className="activity-form"> 

        <div className="form-group">
            <label>ชื่อกิจกรรม</label>
            <input type="text" placeholder="ชื่อกิจกรรม" className="form-input"
                value={activityName}
                onChange={(e)=>{setActivityName(e.target.value!)}}  
            />
        </div>
        

        <div className="form-group">
            <label>ชื่อย่อกิจกรรม</label>
            <input type="text" placeholder="ชื่อย่อกิจกรรม" className="form-input" 
              value={activityShortname}
              onChange={(e)=>{setActivityShortName(e.target.value)}}
            />
        </div>

        <div className="form-row">
            <div className="form-group">
            <label>วันเริ่มกิจกรรม</label>
              <input type="date" className="form-input"
              value={start}
              onChange={((e)=>{setStart(e.target.value)})} />
            </div>
            <div className="form-group">
            <label>วันสิ้นสุดกิจกรรม</label>
            <input type="date" className="form-input"
             value={end}
             onChange={((e)=>{setEnd(e.target.value)})} />
            </div>
        </div>

        <div className="form-group">
            <label>สถานที่จัดกิจกรรม</label>
            <input type="text" placeholder="สถานที่จัดกิจกรรม" className="form-input"
             value={place} 
             onChange={((e)=>setPlace(e.target.value))}
            />
        </div>

        <div className="form-group">
            <label>รูปที่อัปโหลด</label>
            <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            >
            <p>ลาก & วางไฟล์ที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
              <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            </div>

            <div className="image-preview">
            {images.map((img, i) => (
                <div key={i} className={`image-box ${img.isCover ? 'cover' : ''}`}>
                <img src={img.preview} alt={`upload-${i}`} />
                <button type="button" onClick={() => handleSetCover(i)}>
                    {img.isCover ? '✔ รูปปก' : 'ตั้งเป็นปก'}
                </button>
                <button type="button" className="remove-btn" onClick={() => handleRemove(i)}>
                    ×
                </button>
                </div>
            ))}
            </div>
        </div>

        <div className="form-group">
            <label>ข้อกำหนดและเงื่อนไขกิจกรรม</label>
            <textarea placeholder="ระบุข้อกำหนดและเงื่อนไขกิจกรรม" className="form-input textarea"
             value={termsCondition} 
             onChange={(e)=>{setTermsCondition(e.target.value)}}
            />
        </div>

        <div className="form-actions">
            <button type="submit" className="btn btn-primary"
              onClick={()=>{savePublish()}}
            >บันทึก</button>
            <button type="button" className="btn btn-outline">บันทึกแบบร่าง</button>
        </div>
        </div>

    </div>
    </div>
  );
}
