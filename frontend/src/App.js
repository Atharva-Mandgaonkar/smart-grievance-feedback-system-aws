import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ComplaintForm from "./pages/complaints/ComplaintForm";
import ComplaintList from "./pages/complaints/ComplaintList";
import FeedbackForm from "./pages/feedback/FeedbackForm";
import AdminPanel from "./pages/admin/AdminPanel";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Auth pages don't show sidebar/navbar
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top navbar */}
        <Navbar onToggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/complaint/new" element={<ComplaintForm />} />
            <Route path="/complaints" element={<ComplaintList />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;