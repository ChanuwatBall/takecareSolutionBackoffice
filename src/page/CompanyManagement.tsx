import  { useEffect, useState } from "react";
import "./css/CompanyManagement.css"
import Resizer from "react-image-file-resizer";
import { comapanydetailAddEdit, companydetail } from "../action";
const apiUrl = import.meta.env.VITE_API;


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
const CompanyManagement=()=>{
     // Section 1: CEO Information
  const [ceoName, setCeoName] = useState('');
  const [ceoNickName, setCeoNickName] = useState('');
  const [ceoImage, setCeoImage] = useState<File | any>(null);
  const [ceoImageView, setCeoImageView] = useState<File | any>(null);
  const [covermage, setCoverImage] = useState<File | any>(null);

  // Section 2: Team Members Upload
  const [teamMembers, setTeamMembers] = useState<File[]>([]);
  const [teamMembersView, setTeamMembersView] = useState<File | any>(null);
  const [managementTeam, setManagementTeam] = useState<File[]>([]);
  const [managementTeamView, setManagementTeamView] = useState<File[]|any[]>([]);

  // Section 3: Slogan and Vision/History
  const [slogan, setSlogan] = useState('');
  const [history, setHistory] = useState<string[]>([]);


    useEffect(()=>{
        const getcdetail=async ()=>{
            const res = await companydetail()
            console.log("companydetail res ",res)

            setCeoName(res.ceoName)
            setCeoNickName(res.ceoNickName)
            setCeoImageView(apiUrl+"/api/file/drive-image/"+res.ceoImage)
            let teamimg: any[] = []
            await   Promise.all ( 
            res?.teamMembers.map((img:any)=>{
                teamimg = [...teamimg , apiUrl+"/api/file/drive-image/"+img]
            }))
            setTeamMembersView(teamimg)
             let manageteam: any[] = []
            await   Promise.all ( 
            res?.managementTeam.map((img:any)=>{
                manageteam = [...manageteam , apiUrl+"/api/file/drive-image/"+img]
            }))
            setManagementTeamView(manageteam)
            setSlogan(res?.slogan)
            setHistory(res?.history)
            // setCeoImage([])
            // setCoverImage([])
        }
        getcdetail()
    },[])

  // Handle file input for CEO Image
  const handleCeoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        console.log("e.target.files ",e.target.files)
      setCeoImage(e.target.files[0]);
      setCeoImageView( URL.createObjectURL(e.target.files[0]))
    }
  };
   const handleCoverMessageImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCoverImage(e.target.files[0]);
    }
  };

  // Handle multiple file input for team images
  const handleTeamMembersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTeamMembers([...teamMembers, ...Array.from(e.target.files)]);
      setTeamMembersView([...teamMembersView, ...Array.from( e.target.files).map(file=>{ return URL.createObjectURL(file )}) ])
    }
  };

  const handleManagementTeamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setManagementTeam([...managementTeam, ...Array.from(e.target.files)]);
      setManagementTeamView([...managementTeam, ...Array.from( e.target.files).map(file=>{ return URL.createObjectURL(file )}) ])
    }
  };

  // Handle adding history/vision paragraph
  const handleAddHistory = () => {
    setHistory([...history, '']);
  };

  const handleHistoryChange = (index: number, value: string) => {
    const updatedHistory = [...history];
    updatedHistory[index] = value;
    setHistory(updatedHistory);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('ceoName', ceoName);
    formData.append('ceoNickName', ceoNickName);
    if (ceoImage) formData.append('ceoImage', ceoImage);
    // teamMembers.forEach((file:any, index:any) => {
    //   formData.append(`teamMember${index}`, file);
    // });


    await Promise.all(
      teamMembers.map(async (file) => {
        const fileresize:any = await resizeFile(file);
        formData.append(`teamMembers`, fileresize);
        
      })
    );
     await Promise.all(
      managementTeam.map(async (file) => {
        const fileresize:any = await resizeFile(file);
        formData.append(`managementTeam`, fileresize);
        
      })
    ); 
    const historystr:any = history.map(str=>{return str+"#"})
    formData.append('slogan', slogan);
    formData.append('history',historystr); 
     if (covermage) formData.append('coverImages', covermage);
 
    console.log('Form Data:', formData);

    const result = await comapanydetailAddEdit(formData)
    console.log("result ",result)
    // You can make an API call here to submit the data
  };

    return(
     <div className="moo-page" >
       <div style={{ background: "#f2f2f2", padding: "2rem", minHeight: "100vh" }}>

         <form onSubmit={handleSubmit} className="text-left company-manage">
        {/* Section 1: CEO Information */}
        <div>
            <h5>Section 1: About CEO</h5>
            <label>
            Full Name:
            <div className="input"> 
            <input
                type="text" 
                value={ceoName}
                onChange={(e) => setCeoName(e.target.value)}
                required
            /></div>
            </label>
            <label>
            Nickname:
             <div className="input"> 
            <input
                type="text"
                value={ceoNickName}
                onChange={(e) => setCeoNickName(e.target.value)}
                required
            />
            </div>
            </label>
            <div>
                <img src={ceoImageView} alt="" style={{width:"5rem"}} />
            </div>
            <label>
            CEO Image (PNG):
             <div className="input"> 
            <input type="file" accept="image/png" onChange={handleCeoImageChange} required />
            </div>
            </label>
        </div>

        {/* Section 2: Team Members Upload */}
        <div>
            <h5>Section 2: Upload Team Members Images</h5>

            <div>
                {
                    teamMembersView && teamMembersView.map((img:any, index:any)=>
                        <img key={index} src={img} alt={img+index} style={{width:"5rem"}} />
                    )
                }
            </div>
           
            <label>
            Team Members (Multiple Files):
             <div className="input"> 
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleTeamMembersChange}
            />
            </div>
            </label>
            <label> <div>
                {
                    managementTeamView && managementTeamView.map((img:any, index:any)=>
                        <img key={index} src={img} alt={img+index} style={{width:"5rem"}} />
                    )
                }
            </div>
            Management Team (Multiple Files):
             <div className="input"> 
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleManagementTeamChange}
            />
            </div>
            </label>
        </div>

        {/* Section 3: Slogan and Vision */}
        <div>
            <h5>Section 3: Slogan and Vision/History</h5>
            <label>
            Slogan:

             <div className="input"> 
            <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
            />
            </div>
            </label>
              <label>
              Cover Message Card (PNG):
             <div className="input"> 
            <input type="file" accept="image/png" onChange={handleCoverMessageImageChange} required />
            </div>
            </label>

            <div>
            <h5 className="set-row " style={{justifyContent:"flex-start", alignItems:"center"}} >Vision or History (Add multiple paragraphs)  
            &nbsp; <button type="button" onClick={handleAddHistory}>
                <small>เพิ่มย่อหน้า</small>
            </button></h5>
            {history.map((paragraph, index) => (
                <div key={index}>

                <div className="input"> 
                    <textarea
                        value={paragraph}
                        onChange={(e) => handleHistoryChange(index, e.target.value)}
                />
                </div>
                </div>
            ))}
           
            </div>
        </div>

        {/* Submit Button */}
        <div>
            <button type="submit">Submit</button>
        </div>
        </form>
     </div>
    </div>
    )
}

export default CompanyManagement;