
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'; 
import ApexCharts from 'apexcharts';
// import moment from 'moment';
import "./css/Dashboard.css"
import { dashboardCoplaintSummary, dashboardMembers, dashboardMemberStats } from '../action';
import ExportPdfMakeReportButton from '../components/ExportPdfMakeReportButton';
import moment from 'moment/min/moment-with-locales';

moment.locale('th')

var piechart: ApexCharts | null = null

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);
 
 
const Dashboard = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    // const [linechart ,setLine] = useState<any>(null)
    const [memberStats , setMemberState] = useState<any>({})
    const [members,setMember] = useState<any[]>([])
    const [search, setSearch] = useState("");
    const [membersCount,setMemberCount] = useState("0")
    const [ piechartData , setPieChart] = useState<any>({data:[] , labels:[]})
    const [lineChartUri ,setLineChartUri] = useState("")
    const [pieChartUri ,setPieChartUri] = useState("")
   

    const [complaintSummary , setcomplaintSummary] = useState<any>({
      total: 0,
      resolved: 0,
      inProgress: 0,
      complaintInMonth: 0,
      complaintAveragePerPerson: 0 ,
      pendingInMonth : 0,
      inProgressInMonth : 0,
      doneInMonth : 0
    })
  
    let linechart:any =null

  useEffect(()=>{
    const membersRegiter=async ()=>{
      setSelectedMonth(moment().format("YYYY-MM"))
      const memberStats = await dashboardMemberStats(selectedMonth) 
      setMemberState(memberStats)  
      linechart?.updateSeries([{
          name: "Member",
          data:  memberStats?.data
        }])
      linechart?.dataURI().then(({imgURI}:any) => {  
        setLineChartUri(imgURI)
      });

      const cpsumm = await dashboardCoplaintSummary(selectedMonth)
      console.log("cpsumm ",cpsumm)
      setcomplaintSummary(cpsumm)

      const donePercen = (cpsumm?.doneInMonth / cpsumm?.total) * 100;
      const inProcessPercen = (cpsumm?.inProgressInMonth / cpsumm?.total) * 100;
      const pendingPercen = (cpsumm?.pendingInMonth / cpsumm?.total) * 100; 
     
      setPieChart({data: [donePercen ,inProcessPercen + pendingPercen ] , labels:[" ได้รับการแก้ไข" , "กำลังดำเนินการ"] ,cpsumm:cpsumm })
      piechart?.updateSeries(
           [donePercen , inProcessPercen + pendingPercen],
        ) 
    

      const dashmember = await dashboardMembers();
      console.log("dashmember ",dashmember)
      setMember(dashmember?.members)
      setMemberCount(dashmember?.all)
    }
    membersRegiter()
  },[])

  const changeMonth=async (chart:any,month:any)=>{
    setSelectedMonth(month)
     console.log("month ",month)
    const memberStats = await dashboardMemberStats(month) 
      console.log("linechart ",linechart)
      console.log("memberStats ",memberStats)
      setMemberState(memberStats) 
      chart?.updateOptions({
        xaxis: {
          categories:memberStats?.labels
        }
      });
      chart?.updateSeries([{ 
          data:  memberStats?.data
        }])

      const cpsumm = await dashboardCoplaintSummary(month) 
      console.log("cpsumm ",cpsumm)
      setcomplaintSummary(cpsumm)  
      const donePercen = (cpsumm?.doneInMonth / cpsumm?.total) * 100;
      const inProcessPercen = (cpsumm?.inProgressInMonth / cpsumm?.total) * 100;
      const pendingPercen = (cpsumm?.pendingInMonth / cpsumm?.total) * 100; 
     
      piechart?.updateSeries(
           [donePercen , inProcessPercen + pendingPercen],
      )
     piechart?.dataURI().then(({imgURI}:any) => {  
            setPieChart(imgURI)
     });
  }
 
  const filteredMembers = members.filter((m) =>
    `${m.name} ${m.phone} `.toLowerCase().includes(search.toLowerCase())
  );
 
 
  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "2rem" }}> 
    <div className="dashboard-container">
      <div className="dashboard-header">
       
        <input
          type="month"  className='input'
          value={selectedMonth}
          onChange={(e) =>{console.log("e.target.value ",e.target.value) ; setSelectedMonth(moment(e.target.value).format("YYYY-MM"))}}
        />
        <ExportPdfMakeReportButton
        month={selectedMonth}
        memberStats={memberStats}
        complaintSummary={complaintSummary}
        membersCount={membersCount}
        lineChartUri={lineChartUri}
        pieChartUri={pieChartUri}
        members={members}
        piechartData={piechartData}
      />
      </div>

      <div className="card line-chart" id='card-line-chart'>  
        <div className='set-row' >
           <h3>สมาชิกที่ทำการลงทะเบียน</h3>
           <div className='set-row' style={{justifyContent:"center",alignItems:"center"}}>
            <div style={{width:".8rem",height:".8rem",borderRadius:"50%",background: "#3E39FB"}}></div> &nbsp;
            <label style={{fontSize:".8em", margin:"0px",fontWeight:"400"}}>จำนวนสมาชิกที่ทำการลงทะเบียน</label>
           </div>
        </div>
        <MemberRegisterLineChart
         wrapid="card-line-chart"  
         data={memberStats} 
         setLine={(e:any) =>{console.log("crate line ", e); if(e != null){linechart =e}  }}  
         selectedMonth={selectedMonth} 
         chartRef={linechart}
         next={(chart:any)=>{changeMonth(chart,moment(selectedMonth).add(1,"month").format("YYYY-MM"));  }}
         prev={(chart:any)=>{changeMonth(chart,moment(selectedMonth).subtract(1,"month").format("YYYY-MM")); }}
         setUri={(uri:any)=>{ setLineChartUri(uri)}}
        />
        {/* <Line data={memberStats} /> */}
      </div>

      <div className="card-row" >
        <div className="card" style={{width:"50%"}}>
          <h3>การเพิ่มเรื่องร้องทุกข์</h3>
          <div style={{width:"100%" }} className='set-row'> 
            <label>จำนวนเรื่องทั้งหมด </label>
            <label> {complaintSummary?.total} เรื่อง</label>
          </div> 
          <div style={{width:"100%" }} className='set-row'> 
            <label>จำนวนครั้งการเพิ่มเรื่องร้องทุกข์ </label>
            <label> {complaintSummary?.complaintInMonth} เรื่อง</label>
          </div> 
          <div style={{width:"100%" }} className='set-row'> 
            <label>จำนวนเรื่องร้องทุกข์เฉลี่ยต่อคน </label>
            <label> {complaintSummary?.complaintAveragePerPerson?.toFixed(0)} เรื่อง</label>
          </div> 
          
        </div>
        <div className="card"  style={{width:"50%"}} >
          <h3>การดำเนินการเรื่องร้องทุกข์</h3>
          
          <div style={{width:"100%" }} className='set-row'> 
            <label>รอดำเนินการ: </label>
            <label>{complaintSummary?.pendingInMonth} เรื่อง</label>
          </div> 
          <div style={{width:"100%" }} className='set-row'> 
            <label>ดำเนินการแล้ว: </label>
            <label>{complaintSummary?.inProgressInMonth} เรื่อง</label>
          </div> 
           <div style={{width:"100%" }} className='set-row'> 
            <label>เสร็จสมบูรณ์: </label>
            <label>{complaintSummary?.doneInMonth} เรื่อง</label>
          </div>  
        </div>
      </div>

      <div className="card-row">
        <div className="card set-row" style={{width:"100%"}}>
          <div style={{width:"40%"}} > 
            <div style={{border:"1px solid #E5E5E5",padding:".7rem " , borderRadius:"10px"}} >
              <h3  style={{margin:"0"}}>เรื่องร้องทุกข์ทั้งหมด</h3>
              <h1 style={{margin:"0" }}>{complaintSummary?.total }</h1>
            </div> 
            <ul style={{width:"80%"}} >
              <li className='set-row' >
                <div className='set-row' style={{ alignItems:"center" }} >
                  <div style={{width:"1rem" , height:"1rem" , borderRadius:"5px",backgroundColor:  '#4CAF50' }} ></div> &nbsp;
                  <label> ได้รับการแก้ไข:  </label>
                </div> 
                <label> {complaintSummary?.resolved} เรื่อง </label>
              </li>
              <li className='set-row' >
                <div className='set-row' style={{ alignItems:"center" }} >
                  <div style={{width:"1rem" , height:"1rem" , borderRadius:"5px",backgroundColor:  '#F44336' }} ></div> &nbsp;
                  <label> กำลังดำเนินการ:  </label>
                </div> 
                <label> {complaintSummary?.inProgress + complaintSummary?.pendingInMonth } เรื่อง </label>
              </li> 
            </ul>
          </div>
         
          <div id="wrap-piechart" style={{width:"50%", height:"15rem"}} className='set-center' > 
             
            <ComplaintPieChart 
             data={piechartData} 
             wrapid={"wrap-piechart"} 
             setUri={(uri:any)=>{  setPieChartUri(uri)}} 
            />  
             
          </div>
        </div>
      </div>

      <h3 style={{textAlign:"left"}} >รายชื่อสมาชิก</h3>
      <div className="card" style={{width:"50%",maxWidth:"25rem",height:"10rem" , minWidth:"25rem"}}> 
        <h3>จำนวนสมาชิก</h3>
        <p className="member-count"> {membersCount}</p>
      </div><s></s>


      <div className="card set-row" style={{maxWidth:"35rem",padding:"1rem"}}>
        <input 
          type="text" 
          placeholder="ค้นหาจาก ชื่อ หรือ หมายเลขโทรศัพท์" className="search-input" 
          value={search}
          onChange={(e) => setSearch(e.target.value)} 
        />
        <img src="../icons/ionicons/search-outline.svg"   style={{opacity:".2", width:"2rem"}}/> 
      </div>

      <div className="card"> 
        <table className="member-table">
          <thead>
            <tr>
              <th>ชื่อ-นามสกุล</th>
              <th>หมายเลขโทรศัพท์</th>
              <th>วันเกิด</th>
              <th>หมู่</th>
              <th>ร้องทุกข์ปัจจุบัน</th>
              <th>ร้องทุกข์ทั้งหมด</th>
              <th>การดำเนินการ</th>
              <th>ใช้งานล่าสุด</th>
              <th>สถานะ</th>
              <th>วันที่สมัคร</th>
            </tr>
          </thead>
          <tbody >
            {filteredMembers.map((m, idx) => (
              <tr key={idx}>
                <td style={{textAlign:"left"}}>{m.name}</td>
                <td>{m.phone}</td>
                <td>{m.birth}</td>
                <td>{m.village}</td>
                <td>{m.ongoing}</td>
                <td>{m.total}</td>
                <td>{m.done}</td>
                <td>{m.lastUsed}</td>
                <td><span className={"status-tag " + (m.status ? "success":"danger") }>{m.status ? "ใช้งาน" :"ไม่ใช้งาน"}</span></td>
                <td>{m.register}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  ); 
}
export default Dashboard;


const ComplaintPieChart =({data , setUri}:any)=>{
 

  let options = {
     chart: {
       height: 250,
       type: 'pie',
       events: {
        updated:(e:any)=>{ 
           e?.dataURI().then(({imgURI}:any) => {  
            setUri(imgURI)
        });
        }
       }
     },
     series: data?.data  ,
     labels: data?.labels ,
     legend: { show: false },
     colors : ['#4CAF50', '#F44336'], 
     yaxis: { 
       axisBorder: { show: false } ,
       labels: {  show: false, }
     },
     dataLabels: {
       enabled: false },
     tooltip: {
       enabled: false,
     },
     responsive: [{
       breakpoint: 480,
       options: {
         chart: {
           width: 200
         },
         legend: {
           position: 'bottom'
         }
       }
     }]
   } 

   useEffect(()=>{
    console.log("data ",data)
    const createchart=()=>{ 
        const chartcontetnt:any = document.querySelector("#complaint-status-piechart") 

      if( chartcontetnt?.innerHTML.length < 20){
        piechart = new ApexCharts(chartcontetnt, options); 
        piechart.render();  
        piechart.dataURI().then(({imgURI}:any) => { 
            // console.log(imgURI);
            setUri(imgURI)
        });
        // piechart.updateOptions(options)
      }else{  
      } 
    }
    createchart()
  },[])

  return(
    <div>
      <div id='complaint-status-piechart'>  </div>
    </div>
  )
}
 
var chart: ApexCharts | null = null
const MemberRegisterLineChart=({wrapid , data , setLine ,selectedMonth , next , prev ,setUri}:any)=>{

  var options:any = {
    chart: {
      type: 'line' , 
       events: {
        updated:(e:any)=>{ 
           e?.dataURI().then(({imgURI}:any) => {  
            setUri(imgURI)
        });
        }
       }
    },
    series: [{
      name: 'sales',
      data:  data?.data
    }],
    toolbar:{ show:false }, 
    xaxis: { type: 'datetime', categories:  data?.labels,
            labels: {  formatter: function (value:any) {  
               return  moment(value).format("DD MMM") 
            } },
        },
    stroke: {
        show: true,
        curve: 'straight', 
        colors: ["#13147D"  , "#E1D929"],
        width: 1, 
    }, 
    zoom: {
      type: 'x' ,
      enabled: true ,
      autoScaleYaxis: false
    },
     yaxis: {
      labels: {
            style: {
              colors: ["#66676D"],
            },
      }
     },
     grid: {
       strokeDashArray: 1,
       borderColor: '#E0E0E0',
          xaxis: {
            lines: {
              show: true,
            },
          },
          yaxis: { 
            lines: {
              show: true,
            },
          },
        },
  }

  useEffect(()=>{
    const createchart=()=>{
      const el:any = document.getElementById(wrapid)
      let labels: string | any[]  = []
      console.log(el.offsetHeight)
      const startOfMonth = moment().startOf('month').format();
       Array.from(Array(30-labels.length)).map((label,index)=>{
        console.log("label ",label)
          labels = [...labels , moment(startOfMonth).add(index,'days').subtract(1,"month").locale("th").format("YYYY-MM-DD")  ]
       }
      );
      console.log("labels ",labels)

      options = {...options , ...{
        chart:{ type: 'line' ,  height:el.offsetHeight*1.5} , 
        xaxis: {  show: true,  
                tickPlacement: 'on', type: 'datetime', categories: labels,
                labels: { format: 'dd MMM', 
                  style: {
                      colors: ["#66676D"],
                    },
                 },
            }}
        }

      const chartcontetnt:any = document.querySelector("#member-register-linechart") 
      if( chartcontetnt?.innerHTML.length < 20){
        chart = new ApexCharts(chartcontetnt, options); 
        chart.render();
        chart.dataURI().then(({imgURI}:any) => {  
            setUri(imgURI)
        });
        return  setLine(chart)
      }else{ 
        // chart?.updateSeries([{
        //   name: "Member",
        //   data:  data?.data
        // }])
        // return  setLine(chart)
      }
    }
     createchart() 
  },[])

  return(
    <div> 
      <div style={{width:"100%", display:"flex",flexDirection:"row",justifyContent:"space-between" , alignItems:"center",maxHeight:"2rem"}}>
        
          <label style={{fontSize:".7em",marginLeft:"5%", color: "#AEAEAE"}}>สมาชิก</label>
       
         <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
          <button style={{ padding:".5rem", background:"transparent"}}
           onClick={()=>{console.log("chart ",chart) ; prev(chart)}}
          >  
              <img src="../icons/ionicons/chevron-back.svg" className={'icon-carret '} style={{opacity:".2"}} /> 
          </button>
          <div><label style={{fontSize:".7em",margin:"0" , opacity:".5"}}>{moment(selectedMonth).format("MMMM YYYY")}</label></div>
          <button style={{padding:".5rem", background:"transparent"}} 
           onClick={()=>{console.log("chart ",chart) ;next(chart)}}
          >  
              <img src="../icons/ionicons/chevron-forward.svg" className={'icon-carret '} style={{opacity:".2"}}/> 
          </button>
         </div>
         <div style={{width:"3rem"}}></div>
      </div>
     <div id='member-register-linechart'>  </div>
    </div>
  )
}
