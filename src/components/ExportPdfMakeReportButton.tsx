// ExportPdfMakeReportButton.tsx 
import moment from "moment"; 
import pdfMake  from "../utils/pdfmake" // ใช้ตัวที่ตั้งฟอนต์ไว้
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import { companymember, getActivities, getCookie, getDefaultCompay, getMembers, lastcomplaint } from "../action";
 

moment.locale("th");

type MemberStats = { labels: string[]; data: number[] };
type ComplaintSummary = {
  total: number;
  resolved: number;
  inProgress: number;
  complaintInMonth: number;
  complaintAveragePerPerson: number;
  pendingInMonth: number;
  inProgressInMonth: number;
  doneInMonth: number;
};
type MemberRow = {
  name: string; phone: string; birth: string;
  village: number; ongoing: number; total: number; done: number;
  lastUsed: string; status: boolean; register: string;
};

// function buildKpis(c: ComplaintSummary) {
//   const safe = (n: number) => (Number.isFinite(n) ? n : 0);
//   const isZero = c.total === 0;
//   const donePct = safe(isZero ? 0 : (c.doneInMonth / c.total) * 100);
//   const inProgPct = safe(isZero ? 0 : (c.inProgressInMonth / c.total) * 100);
//   const pendingPct = safe(isZero ? 0 : (c.pendingInMonth / c.total) * 100);
//   return {
//     monthTotal: c.complaintInMonth,
//     overallTotal: c.total,
//     monthDone: c.doneInMonth,
//     monthInProgress: c.inProgressInMonth,
//     monthPending: c.pendingInMonth,
//     avgPerPerson: c.complaintAveragePerPerson ?? 0,
//     rates: {
//       donePct: Number(donePct.toFixed(1)),
//       inProgressPct: Number(inProgPct.toFixed(1)),
//       pendingPct: Number(pendingPct.toFixed(1)),
//       unfinishedPct: Number((inProgPct + pendingPct).toFixed(1)),
//     },
//   };
// }
// interface Company {
//     "id":  Number
//     "name": String
//     "liffId": String
//     "liffUrl": String
//     "logo": String
//     "company": null,
//     "district": null
// }

export default function ExportPdfMakeReportButton({
  month, 
  complaintSummary,
  // membersCount,
  // piechartData,
  pieChartUri,
  members,
}: {
  month: string;
  memberStats: MemberStats;
  complaintSummary: ComplaintSummary;
  membersCount: string | number;
  lineChartUri: string;
  pieChartUri: string;
  members: MemberRow[];
  piechartData:any
}) {
  // const [company , setCompany] = useState<Company | null>(null)
  const handleExport = async () => { 
    const decom = await getDefaultCompay()
    console.log("decom ",decom)
    // setCompany(decom)
    const membercom = await companymember()
    console.log("membercom ",membercom)

    let lstCom = await lastcomplaint()
    console.log("lstCom ",lstCom)

    const mLabel = moment(month).format("MMMM YYYY");
    // const k = buildKpis(complaintSummary);
    const user = await getCookie("user_info") 
    const bodyComplaint = [
      [
        { text: 'ลำดับ', style: 'th' },
        { text: 'เบอร์โทร', style: 'th' },
        { text: 'หัวข้อ', style: 'th'  },
        { text: 'รายละเอียด', style: 'th'  },
        { text: 'สถานะ', style: 'th'  },
      ],
      ...lstCom.map((r:any,index:any) => ([
        index , r?.phone  , r?.topic , r?.detail , r?.status
      ]) )
    ]
      

   const officer = await getMembers()
   console.log("officer ",officer)
   let officeBody = [
    [
      { text: 'ชื่อ', style: 'th' },
      { text: 'อีเมล', style: 'th' },
      { text: 'เบอร์โทร', style: 'th'  },
    ],
    ...officer.map((m:any)=>([
      m?.name , m?.email , m?.phoneNumber
    ]))
   ]
 
   const activity = await getActivities()
   console.log("getActivities activity  ",activity)
   let activityBody = [
    [
      { text: 'ลำดับ', style: 'th' },
      { text: 'กิจกรรม', style: 'th' },
      { text: 'สถานะ', style: 'th'  },
    ],
    ...activity.map((m:any , index:any)=>([
      index+1 , m?.shortName , m?.enable ? "เผยแพร่" :"ดราฟ"
    ]))
   ]

  const bodymembercount = [
    // header row
    [
      { text: 'ตำบล', style: 'th' },
      { text: 'หมู่บ้าน', style: 'th' },
      { text: 'สมาชิก', style: 'th'  },
    ],
    // data rows
    ...membercom.map((r:any) => ([
      r.subdistrictName,
      r.villageName,
      { text: Number(r.member).toLocaleString()  }
    ])), 
  ];
 

    const docDefinition: TDocumentDefinitions = {
      info: {
        title: `รายงานผลระบบบริหารจัดการประชาชน`,
        author: user?.name,
      },
      pageMargins: [28, 40, 28, 40],
      defaultStyle: {
        font: "THSarabunNew", // ถ้าไม่มี vfs ไทย ให้เปลี่ยนเป็น 'Roboto'
        fontSize: 10,
      },
      styles: {
        h1: { fontSize: 18, bold: true, margin: [0, 0, 0, 4] },
        h2: { fontSize: 14, bold: true, margin: [0, 8, 0, 4] },
        h3: { fontSize: 14, bold: true, margin: [0, 4, 0, 4] },
        th: { bold: true, fillColor: "#F5F5F5" },
        kpiNum: { fontSize: 24, bold: false, margin: [0, 2, 0, 0] },
        muted: { color: "#777" },
      },
      header: (currentPage:any, pageCount:any) => ({
        margin: [28, 12, 28, 0],
        columns: [
          // { text: `รายงานสรุป ${mLabel}`, style: "h2" },
          { text: "" } ,
          { text: `หน้า ${currentPage}/${pageCount}`, alignment: "right", style: "muted" },
        ],
      }),
      footer: () => ({
        margin: [28, 0, 28, 12],
        columns: [
          // { text: `พิมพ์เมื่อ ${moment().format("DD MMM YYYY HH:mm")}`, style: "muted" },
          // { text: "ออกรายงานโดย "+ user?.name , alignment: "right", style: "muted" },
        ],
      }),
      content: [
        { text: `รายงานผลระบบบริหารจัดการประชาชน `, style: "h1" , alignment:"center" },  
        { text: "เทศบาลตำบล/อบต. " + decom?.name , style: "h2", alignment:"center" }, { text: " "  },  
        { text: `เดือน:  ${mLabel} `}, // จัดทำโดย: [ใส่ชื่อเจ้าหน้าที่/ระบบ]
        { text: `จัดทำโดย: ${user?.name} `},
        { text: `วันที่จัดทำรายงาน: ${moment().format("DD/MM/YYYY")} `},
   
        { text: `1. ข้อมูลสมาชิกในระบบ`, style: "h3" },
        { text: `จำนวนสมาชิกทั้งหมด: ${members?.length} คน`},
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', 60],
            body: bodymembercount
          },
          layout: "lightHorizontalLines", 
        },

        { text:""}, { text: " "  }, { text: " "  },  
        //2. สถิติเรื่องร้องทุกข์ (ถึงวันที่ 29 มิถุนายน 2025)
        { text: `2. สถิติเรื่องร้องทุกข์ (ถึงวันที่ ${moment().format("DD MMMM YYYY")} )`, style: "h3" }, 
        { columns: [{ text: "รายการ" }, { text:  "จำนวน" }] },
        { columns: [{ text: "จำนวนเรื่องร้องทุกข์ทั้งหมด" }, { text: complaintSummary?.total+" เรื่อง"  }] },
        { columns: [{ text: "เรื่องที่อยู่ระหว่างดำเนินการ" }, { text: complaintSummary?.inProgress+" เรื่อง"  }] },
        { columns: [{ text: "เรื่องที่ดำเนินการเสร็จสิ้นแล้ว" }, { text: complaintSummary?.resolved+" เรื่อง"}] },
        { columns: [{ text: "เรื่องร้องเรียนซ้ำ" }, { text:complaintSummary?.pendingInMonth +" เรื่อง" }] },
        { columns: [{ text: "เรื่องร้องเรียนที่ต่อเนื่อง" }, { text: complaintSummary?.complaintInMonth+" เรื่อง"  }] },

        { text:""}, { text: " "  }, { text: " "  },  
     
        { text: `3. สถานะเรื่องร้องทุกข์`, style: "h3" }, 
        // { text: "กราฟภาพรวม", style: "h2", margin: [0, 12, 0, 6] },
        {
          columns: [
            {
              width: "20%",
              stack: [
                { text: " "  },
                { text: "ได้รับการแก้ไข "+ complaintSummary?.resolved , },
                { text: "กำลังดำเนินการ"+ complaintSummary?.inProgress  , }
              ],
            },
            {
              width: "40%",
              stack: [
                { text: "สรุปสถานะ (Pie)", bold: true, margin: [0, 0, 0, 4] ,  alignment: 'center'  },
                pieChartUri
                  ? { image: pieChartUri, width: 130 , alignment: 'center' }
                  : { text: "ไม่มีรูปกราฟ", style: "muted" },
              ],
            },
          ],
          columnGap: 10,
        }, 
        { text:""}, { text: " "  }, { text: " "  },  

        { text: `4. รายการร้องทุกข์ล่าสุด `, style: "h3" },  
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*","*"],
            body: bodyComplaint,
          },
          layout: "lightHorizontalLines",
        }, 
        // { text: "กราฟภาพรวม", style: "h2", margin: [0, 12, 0, 6] },
        //
        { text:""}, { text: " "  }, { text: " "  }, 
        { text: `5. รายชื่อเจ้าหน้าที่ผู้ดูแลระบบ`, style: "h3" },  
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*" ],
            body: officeBody,
          },
          layout: "lightHorizontalLines",
        }, 

        { text:""}, { text: " "  }, { text: " "  },  
        { text: `6. กิจกรรมที่จัดขึ้น`, style: "h3" },  
        {
          table: {
            headerRows: 1,
            widths: [20, "*", "*" ],
            body: activityBody,
          },
          layout: "lightHorizontalLines",
        }, 
         { text: " "  }, { text: " "  }, { text: " "  }, { text: " "  },
         {
          columns: [
            {
              width: "60%",
              stack: [
                { text: " "  }  ],
            },
             {
              width: "40%",
              stack: [
                { text: "ลงชื่อ ........................................................................  ผู้จัดทำรายงาน "  }, 
                { text: "วันที่ ........................................................................"  }, 
              ],
            },
          ]
        },


        // // ตารางสมาชิกย่อ
        // { text: "ตารางสมาชิก (แสดง 15 รายแรก)", style: "h2", margin: [0, 12, 0, 6] },
        // {
        //   table: {
        //     headerRows: 1,
        //     widths: [20, "*", 90, 30, 40, 40, 50],
        //     body: membersTableBody,
        //   },
        //   layout: "lightHorizontalLines",
        // }, 
        { text:"" } ,
        // { text: ["ออกรายงานโดย ", user?.name] , bold: true, margin: [20, 0, 0, 4] ,  alignment: 'right'  },
      ],
    };

    pdfMake.createPdf(docDefinition).open() //.download(`รายงาน_${mLabel}.pdf`);
  };

  return (
    <button onClick={handleExport} style={{padding:"" , color:"black" , background:"#FFF",borderRadius:"10px", margin:"0 .5rem 0 .5rem",cursor:"pointer"}}>
      <label style={{fontWeight:"400"}} > สร้างรายงาน</label> 
    </button>
  );
}
