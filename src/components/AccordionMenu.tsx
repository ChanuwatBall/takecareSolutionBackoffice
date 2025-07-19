import React, { useEffect, useState } from 'react';
import "./css/AccordionMenu.css"

type Village = {
  id: number;
  name: string;
};

type Subdistrict = {
  id: number;
  subdistrict: string;
  villages: Village[];
};

type Props = {
  data: Subdistrict[];
  select:(e:any)=> void
};


const AccordionMenu: React.FC<Props> = ({ data ,select }) => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [openVillageId, setOpenVillageId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  const handleVillageToggle = (id: number) => {
    setOpenVillageId(prev => (prev === id ? null : id));
    return select(id)
  };

  useEffect(()=>{ 
    setTimeout(()=>{
        if(data.length > 0 ){ 
          handleToggle(data[0].id)
        }
    },1000)
  },[])

  return (
    <div className="accordion-menu">
      {data.length > 1 && data.map((sub) => (
        <div key={sub.id}  className='wrap-subdistrict' >
          <div 
            className='subdistrict'
            style={{ }}
            onClick={() => handleToggle(sub.id)}
          >
            {/* {openId === sub.id ? '▼' : '▶'}  */}
            <img src="../icons/ionicons/caret-forward.svg" className={'icon-carret '+ (openId=== sub.id ? "open":"close") } />
            {sub.subdistrict}
          </div>

          {openId === sub.id && (
            <div style={{ paddingLeft: 24 }}>
              {sub.villages.map((village) => (
                <div className='village' key={village.id} style={{ marginBottom: 4 }}>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleVillageToggle(village.id)}
                  >
                     <img src="../icons/ionicons/caret-forward.svg" className={'icon-carret '} />
                    {/* {openVillageId === village.id ? '▼' : '▶'}  */}
                    {village.name}
                  </span>
                </div>
              ))}
            </div>
          )}
 
        </div>
      ))}

       {data.length === 1 && 
         openId === data[0].id && (
            <div style={{ paddingLeft: 24 }}>
              {data[0].villages.map((village) => (
                <div className='village' key={village.id} style={{ marginBottom: 4 }}>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleVillageToggle(village.id)}
                  >
                     <img src="../icons/ionicons/caret-forward.svg" className={'icon-carret '} />
                    {/* {openVillageId === village.id ? '▼' : '▶'}  */}
                    {village.name}
                  </span>
                </div>
              ))}
            </div>
          )} 
    </div>
  );
};

export default AccordionMenu;