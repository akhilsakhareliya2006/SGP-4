import Navbar from "./components/Navbar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import CollegeRegister from "./pages/CollegeRegister";
import CompanyRegister from "./pages/CompanyRegister";
import RegisterChoice from "./pages/RegisterChoice";
import DashboardLayout from "./layouts/DashboardLayout";
import EmployeesPage from "./pages/dashboard/EmployeesPage";
import JobsPage from "./pages/dashboard/JobsPage";
import ApplicationsPage from "./pages/dashboard/ApplicationsPage";
import CollaborationPage from "./pages/dashboard/CollaborationPage";
import AdminSettingsPage from "./pages/dashboard/AdminSettingsPage";

function App() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <>
      {/* Navbar only on auth / public pages */}
      {!isDashboardRoute && <Navbar />}

      {/* Pages below navbar */}
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/college" element={<CollegeRegister />} />
        <Route path="/register/company" element={<CompanyRegister />} />
        <Route path="/register" element={<RegisterChoice />} />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="employees" replace />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="collaboration" element={<CollaborationPage />} />
          <Route path="admin-settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;


