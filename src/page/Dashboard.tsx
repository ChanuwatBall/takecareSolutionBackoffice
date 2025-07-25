
import React, { useState } from 'react';
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
import { Line, Pie } from 'react-chartjs-2';
import "./css/Dashboard.css"

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

  const memberStats = {
    labels: ['01', '02', '03', '04', '05', '06'],
    datasets: [
      {
        label: 'สมาชิกที่ทำการลงทะเบียน',
        data: [10, 15, 30, 60, 300, 150],
        borderColor: '#3f51b5',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const complaintSummary = {
    total: 1130,
    resolved: 1097,
    inProgress: 612,
  };

  const complaintChartData = {
    labels: ['ได้รับการแก้ไข', 'กำลังดำเนินการ'],
    datasets: [
      {
        label: 'เรื่องร้องทุกข์',
        data: [1097, 612],
        backgroundColor: ['#4CAF50', '#F44336'],
        hoverOffset: 4,
      },
    ],
  };

  const members = [
    { name: 'นางพัชญา นพเกล้าเทียน', phone: '0987654321', birth: '11 มิ.ย. 1989', village: 1, ongoing: 1, total: 2, done: 1, lastUsed: 'วันนี้', status: 'ผ่านใช้งาน', register: '11 มิ.ย. 2025' },
    { name: 'พูน ทะโนกา', phone: '0987654333', birth: '14 มิ.ย. 1998', village: 1, ongoing: 1, total: 2, done: 1, lastUsed: 'วันนี้', status: 'ผ่านใช้งาน', register: '11 มิ.ย. 2025' },
  ];

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "2rem" }}> 
    <div className="dashboard-container">
      <div className="dashboard-header">
       
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="card line-chart">
        <h3>สมาชิกที่ทำการลงทะเบียน</h3>
        <Line data={memberStats} />
      </div>

      <div className="card-row">
        <div className="card">
          <h3>การเพิ่มเรื่องร้องทุกข์</h3>
          <p>จำนวนเรื่องทั้งหมด: 1130 เรื่อง</p>
          <p>จำนวนครั้งการเพิ่มเรื่อง: 5 ครั้ง</p>
          <p>จำนวนชื่อร้องทุกข์ซ้ำ: 5 เรื่อง</p>
        </div>
        <div className="card">
          <h3>การดำเนินการเรื่องร้องทุกข์</h3>
          <p>ดำเนินการแล้ว: 612 เรื่อง</p>
          <p>เสร็จสมบูรณ์: 600 เรื่อง</p>
        </div>
      </div>

      <div className="card-row">
        <div className="card">
          <h3>เรื่องร้องทุกข์ทั้งหมด</h3>
          <h1>{complaintSummary.total.toLocaleString()}</h1>
          <ul>
            <li style={{ color: '#4CAF50' }}>ได้รับการแก้ไข: {complaintSummary.resolved} เรื่อง</li>
            <li style={{ color: '#F44336' }}>กำลังดำเนินการ: {complaintSummary.inProgress} เรื่อง</li>
          </ul>
        </div>
        <div className="card">
          <Pie data={complaintChartData} />
        </div>
      </div>

      <div className="card">
        <h3>รายชื่อสมาชิก</h3>
        <p className="member-count">จำนวนสมาชิก: 2,248</p>
        <input type="text" placeholder="ค้นหาจาก ชื่อ หรือ หมายเลขโทรศัพท์" className="search-input" />
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
          <tbody>
            {members.map((m, idx) => (
              <tr key={idx}>
                <td>{m.name}</td>
                <td>{m.phone}</td>
                <td>{m.birth}</td>
                <td>{m.village}</td>
                <td>{m.ongoing}</td>
                <td>{m.total}</td>
                <td>{m.done}</td>
                <td>{m.lastUsed}</td>
                <td><span className="status-tag success">{m.status}</span></td>
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
