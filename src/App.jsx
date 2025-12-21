import Navbar from "./components/Navbar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/auth/Login";
import RegisterChoice from "./pages/auth/RegisterChoice";
import CollegeRegister from "./pages/college/CollegeRegister";
import CompanyRegister from "./pages/company/CompanyRegister";

import DashboardLayout from "./pages/company/side_nav_bar";
import EmployeesPage from "./pages/company/EmployeesPage";
import JobsPage from "./pages/company/JobsPage";
import ApplicationsPage from "./pages/company/ApplicationsPage";
import CollaborationPage from "./pages/company/CollaborationPage";
import AdminSettingsPage from "./pages/company/AdminSettingsPage";
import DashboardPage from "./pages/company/DashboardPage";

function App() {
  const location = useLocation();

  // ✅ Hide navbar on ALL dashboard / sidebar pages
  const hideNavbar =
    location.pathname.startsWith("/employee") ||
    location.pathname.startsWith("/college") ||
    location.pathname.startsWith("/company") ||
    location.pathname.startsWith("/dashboard");

  return (
    <>
      {/* ✅ Navbar only for auth/public pages */}
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ---------- Auth / Public ---------- */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterChoice />} />
        <Route path="/register/college" element={<CollegeRegister />} />
        <Route path="/register/company" element={<CompanyRegister />} />

        {/* ---------- Company Dashboard ---------- */}
        <Route path="/employee" element={<DashboardLayout />}>
          <Route index element={<Navigate to="employees" replace />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="collaboration" element={<CollaborationPage />} />
          <Route path="admin-settings" element={<AdminSettingsPage />} />
        </Route>

        {/* ---------- Fallback ---------- */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
