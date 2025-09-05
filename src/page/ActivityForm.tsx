import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import "./css/ActivityForm.css"
import { createActivity  } from '../action';
import { useAlert } from '../components/AlertContext';
import Resizer from "react-image-file-resizer";
import { useNavigate } from 'react-router-dom';

const resizeFile = (file:any) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      500,
      1200,
      "JPG",
      70,
      0,
      (File) => {
        resolve(File);
      },
      "file"
    );
  });

type ImageData = {
  file: File;
  preview: string;
  isCover: boolean;
};

export default function ActivityForm() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate()

  const [activityName , setActivityName] = useState("")
  const [activityShortname , setActivityShortName] = useState("")
  const [start,setStart] = useState("")
  const [end , setEnd] = useState("")
  const [place , setPlace] = useState("")
  const [termsCondition , setTermsCondition] = useState("")
  const [showAlert] = useAlert();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading , setLoading] = useState(false)
  const [error, setError] = useState<string>("");
  

//   const [imgs, setImages] = useState([]/)

useEffect(()=>{
})

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    console.log("file ", files) 
   
    const fileArray = Array.from(files);

    const imageslist:any[] = await Promise.all(
      fileArray.map(async (file) => {
        const fileresize = await resizeFile(file);
        return {
          file: fileresize,
          preview: URL.createObjectURL(file),
          isCover: false,
        };
      })
    );

     console.log("imageslist ", imageslist)
    // const newImages: ImageData[] = Array.from(files).map((file) => ({
    //   file,
    //   preview: URL.createObjectURL(file),
    //   isCover: false,
    // })); 
    setImages((prev) => [...prev, ...imageslist]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e:any|ChangeEvent<HTMLInputElement>) => {
    const maxSizeMB = 2; // limit 2MB
    const files:any = Array.from(e.target.files);

    const validFiles = files.filter((file:any) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`❌ ${file.name} is larger than ${maxSizeMB} MB`);
        return false;
      }
      return true;
    });
    if (validFiles.length) {
       handleFiles(e.target.files);
       setError("")
    }
  };

  const handleSetCover = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isCover: i === index }))
    );
  };

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const savePublish=async(isDraft:any)=>{ 
    setLoading(true)
    const formData = new FormData();
    
    await  images.forEach(async (img ) => {  
    
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
   formData.append('isDraft',isDraft);


   for (const [key, value] of formData.entries()) {
    console.log(key , " = ", value);
    } 
    const result = await createActivity(formData);
    console.log("result ",result)
   if(result?.result){ 
       showAlert('เพิ่มกิจกรรม'+(isDraft ? "แบบร่าง":"เผยแพร่")+'สำเร็จ', 'success') 
     }else{
      showAlert('เพิ่มกิจกรรม'+(isDraft ? "แบบร่าง":"เผยแพร่")+'ไม่สำเร็จ',"error")
     }
    setLoading(false)
    navigate("/activities")
  }

  return ( 
    <div   >
      <div style={{ maxWidth: "1200px", margin: "0 auto",paddingTop:"2.5rem",textAlign:"left", marginBottom:"10rem"}}>
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
            <label style={{display:"flex",alignItems:"center"}} >รูปที่อัปโหลด <sub>&nbsp; อัปโหลดรูปได้ไม่เกิน 2 MB</sub> </label>
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
             {error && <p style={{ color: "red", fontSize:"small" }}>{error}</p>}
            <div className="image-preview">
            {images.map((img, i) => (
                <div key={i} className={`image-box ${img.isCover ? 'cover' : ''}`}>
                <img src={img.preview} alt={`upload-${i}`} />
                <button type="button" onClick={() => handleSetCover(i)}>
                    {img.isCover ? '✔ รูปปก' : 'ตั้งเป็นปก'}
                </button>
                <button type="button" className="remove-btn" onClick={() => handleRemove(i)}>
                    X
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
            <button type="submit" className="btn btn-outline"
              onClick={()=>{savePublish(false)}}
            >บันทึก</button>
            <button type="button" className="btn btn-outline" 
              onClick={()=>{savePublish(true)}}
            >บันทึกแบบร่าง</button>
            {loading && <div className="spinner"></div>} &nbsp;
        </div>
        </div>
       <br/><br/><br/><br/>
    </div> 
    </div>
  );
}
