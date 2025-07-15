

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from './page/Home'
import { useState, type JSX } from 'react'
import Dashboard from './page/Dashboard'
import Login from './page/Login'
import { isAuthenticated } from './auth'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'



import './App.css'

function App() { 

  return ( 
      <Layout /> 
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
        <div style={{ flex: 1, padding: "1rem" }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
                <ProtectedRoute> 
                  <Home /> 
                </ProtectedRoute>} /> 
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
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
