// ExportPdfMakeReportButton.tsx 
import moment from "moment"; 
import pdfMake  from "../utils/pdfmake" // ใช้ตัวที่ตั้งฟอนต์ไว้
import type { TDocumentDefinitions } from "pdfmake/interfaces";

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

function buildKpis(c: ComplaintSummary) {
  const safe = (n: number) => (Number.isFinite(n) ? n : 0);
  const isZero = c.total === 0;
  const donePct = safe(isZero ? 0 : (c.doneInMonth / c.total) * 100);
  const inProgPct = safe(isZero ? 0 : (c.inProgressInMonth / c.total) * 100);
  const pendingPct = safe(isZero ? 0 : (c.pendingInMonth / c.total) * 100);
  return {
    monthTotal: c.complaintInMonth,
    overallTotal: c.total,
    monthDone: c.doneInMonth,
    monthInProgress: c.inProgressInMonth,
    monthPending: c.pendingInMonth,
    avgPerPerson: c.complaintAveragePerPerson ?? 0,
    rates: {
      donePct: Number(donePct.toFixed(1)),
      inProgressPct: Number(inProgPct.toFixed(1)),
      pendingPct: Number(pendingPct.toFixed(1)),
      unfinishedPct: Number((inProgPct + pendingPct).toFixed(1)),
    },
  };
}

export default function ExportPdfMakeReportButton({
  month, 
  complaintSummary,
  membersCount,
  lineChartUri,
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
}) {
  const handleExport = () => {
    const mLabel = moment(month).format("MMMM YYYY");
    const k = buildKpis(complaintSummary);

    const membersTableBody = [
      [
        { text: "#", style: "th" },
        { text: "ชื่อ-นามสกุล", style: "th" },
        { text: "โทร", style: "th" },
        { text: "หมู่", style: "th" },
        { text: "ทั้งหมด", style: "th" },
        { text: "เสร็จ", style: "th" },
        { text: "สถานะ", style: "th" },
      ],
      ...members.slice(0, 15).map((m, i) => ([
        i + 1,
        { text: m.name, alignment: "left" },
        m.phone,
        m.village,
        m.total,
        m.done,
        m.status ? "ใช้งาน" : "ไม่ใช้งาน",
      ])),
    ];

    const docDefinition: TDocumentDefinitions = {
      info: {
        title: `รายงานประจำเดือน ${mLabel}`,
        author: "Andaman Tracking",
      },
      pageMargins: [28, 40, 28, 40],
      defaultStyle: {
        font: "THSarabunNew", // ถ้าไม่มี vfs ไทย ให้เปลี่ยนเป็น 'Roboto'
        fontSize: 10,
      },
      styles: {
        h1: { fontSize: 18, bold: true, margin: [0, 0, 0, 4] },
        h2: { fontSize: 14, bold: true, margin: [0, 8, 0, 4] },
        th: { bold: true, fillColor: "#F5F5F5" },
        kpiNum: { fontSize: 16, bold: true, margin: [0, 2, 0, 0] },
        muted: { color: "#777" },
      },
      header: (currentPage:any, pageCount:any) => ({
        margin: [28, 12, 28, 0],
        columns: [
          { text: `รายงานสรุป ${mLabel}`, style: "h2" },
          { text: `หน้า ${currentPage}/${pageCount}`, alignment: "right", style: "muted" },
        ],
      }),
      footer: (currentPage:any, pageCountv) => ({
        margin: [28, 0, 28, 12],
        columns: [
          { text: `พิมพ์เมื่อ ${moment().format("DD MMM YYYY HH:mm")}`, style: "muted" },
          { text: "Andaman Tracking", alignment: "right", style: "muted" },
        ],
      }),
      content: [
        { text: `รายงานสรุปประจำเดือน ${mLabel}`, style: "h1" },
        { text: "ภาพรวมตัวชี้วัด (KPI)", style: "h2" },

        // KPI 4 ช่อง
        {
          columns: [
            { stack: [{ text: "เรื่องร้องทุกข์ (รวมทั้งหมด)" }, { text: String(k.overallTotal ?? 0), style: "kpiNum" }], width: "25%" },
            { stack: [{ text: "เรื่องที่เพิ่มในเดือนนี้" }, { text: String(k.monthTotal ?? 0), style: "kpiNum" }], width: "25%" },
            { stack: [{ text: "เฉลี่ยเรื่อง/คน" }, { text: (k.avgPerPerson ?? 0).toFixed(2), style: "kpiNum" }], width: "25%" },
            { stack: [{ text: "จำนวนสมาชิกทั้งหมด" }, { text: String(membersCount ?? 0), style: "kpiNum" }], width: "25%" },
          ],
          columnGap: 10,
        },

        { text: "สถานะดำเนินการ (เดือนนี้)", style: "h2", margin: [0, 10, 0, 6] },
        {
          table: {
            widths: ["*", "auto", "auto", "auto", "auto"],
            body: [
              [
                { text: "หมวด", style: "th" },
                { text: "รอดำเนินการ", style: "th" },
                { text: "กำลังดำเนินการ", style: "th" },
                { text: "เสร็จสมบูรณ์", style: "th" },
                { text: "% เสร็จสิ้น", style: "th" },
              ],
              [
                "เดือนนี้",
                k.monthPending,
                k.monthInProgress,
                k.monthDone,
                `${k.rates.donePct}%`,
              ],
            ],
          },
          layout: "lightHorizontalLines",
        },

        // แนวทาง A: แทรกรูปกราฟจาก ApexCharts
        { text: "กราฟภาพรวม", style: "h2", margin: [0, 12, 0, 6] },
        {
          columns: [
            {
              width: "60%",
              stack: [
                { text: "การสมัครสมาชิก (Line)", bold: true, margin: [0, 0, 0, 4] },
                lineChartUri
                  ? { image: lineChartUri, width: 350 }
                  : { text: "ไม่มีรูปกราฟ", style: "muted" },
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

        // ตารางสมาชิกย่อ
        { text: "ตารางสมาชิก (แสดง 15 รายแรก)", style: "h2", margin: [0, 12, 0, 6] },
        {
          table: {
            headerRows: 1,
            widths: [20, "*", 90, 30, 40, 40, 50],
            body: membersTableBody,
          },
          layout: "lightHorizontalLines",
        },
      ],
    };

    pdfMake.createPdf(docDefinition).download(`รายงาน_${mLabel}.pdf`);
  };

  return (
    <button onClick={handleExport} style={{padding:"" , color:"black" , background:"#FFF",borderRadius:"10px", margin:"0 .5rem 0 .5rem",cursor:"pointer"}}>
      <label style={{fontWeight:"400"}} > สร้างรายงาน</label> 
    </button>
  );
}
