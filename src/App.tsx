

import {  Routes, Route,  Navigate } from "react-router-dom"; 
import { useState, type JSX } from 'react'
import Dashboard from './page/Dashboard'
import Login from './page/Login'
import { isAuthenticated } from './auth'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'



import './App.css'
import MooID from "./page/MooID";
import ComplaintPage from "./page/ComplaintPage";
import ActivityForm from "./page/ActivityForm";
import Activities from "./page/Activities";
import { AlertProvider } from "./components/AlertContext";
import Setting from "./page/Setting";
import MemberSettings from "./page/MemberSettings";


function App() { 

  return ( 
    <AlertProvider> 
      <Layout /> 
    </AlertProvider>
  )
}

export default App


const Layout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <>
      {isAuthenticated() && <Navbar onToggle={toggleSidebar} />}
      <div style={{ display: "flex" }}>
        {isAuthenticated() && isSidebarOpen && <Sidebar />}
        <div className="page" style={{ flex: 1 ,  }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
                <ProtectedRoute> 
                  <Dashboard /> 
                </ProtectedRoute>} /> 
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/moo/:id" element={
                <ProtectedRoute> 
                  <MooID /> 
                </ProtectedRoute>} 
            />
            <Route path="/complaint/:id" element={
                <ProtectedRoute> 
                  <ComplaintPage /> 
                </ProtectedRoute>} 
            />
             <Route path="/activity/form" element={
                <ProtectedRoute> 
                  <ActivityForm /> 
                </ProtectedRoute>} 
            />

            <Route path="/activities" element={
                <ProtectedRoute> 
                  <Activities /> 
                </ProtectedRoute>} 
            />

             <Route path="/setting" element={
                <ProtectedRoute> 
                  <Setting /> 
                </ProtectedRoute>} 
            />
            <Route path="/setting/members" element={
                <ProtectedRoute> 
                  <MemberSettings /> 
                </ProtectedRoute>} 
            />
            

            
          </Routes>
        </div>
      </div>
    </>
  );
};

interface ProtectedRouteProps {
  children: JSX.Element;
}
 
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
