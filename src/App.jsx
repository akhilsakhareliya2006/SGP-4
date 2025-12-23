import Navbar from "./components/Navbar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/auth/Login";
import RegisterChoice from "./pages/auth/RegisterChoice";
import CollegeRegister from "./pages/college/CollegeRegister";
import CompanyRegister from "./pages/company/CompanyRegister";

/* ---------- Company ---------- */
import CompanyDashboardLayout from "./pages/company/side_nav_bar";
import EmployeesPage from "./pages/company/EmployeesPage";
import JobsPage from "./pages/company/JobsPage";
import ApplicationsPage from "./pages/company/ApplicationsPage";
import CollaborationPage from "./pages/company/CollaborationPage";
import AdminSettingsPage from "./pages/company/AdminSettingsPage";
import DashboardPage from "./pages/company/DashboardPage";

/* ---------- College ---------- */
import CollegeDashboardLayout from "./pages/college/side_nav_bar";
import CollegeDashboard from "./pages/college/DashboardPage";
import MentorsPage from "./pages/college/MentorsPage";
import CollegeJobsPage from "./pages/college/JobsPage";
import StudentsPage from "./pages/college/StudentsPage";
import CollegeCollaborationPage from "./pages/college/CollaborationPage";
import CollegeAdminSettingsPage from "./pages/college/AdminSettingsPage";

function App() {
  const location = useLocation();

  // Hide navbar on dashboards
  const hideNavbar =
    location.pathname.startsWith("/company") ||
    location.pathname.startsWith("/college");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ---------- Auth ---------- */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterChoice />} />
        <Route path="/register/college" element={<CollegeRegister />} />
        <Route path="/register/company" element={<CompanyRegister />} />

        {/* ---------- Company Dashboard ---------- */}
        <Route path="/company" element={<CompanyDashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="collaboration" element={<CollaborationPage />} />
          <Route path="admin-settings" element={<AdminSettingsPage />} />
        </Route>

        {/* ---------- College Dashboard ---------- */}
        <Route path="/college" element={<CollegeDashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CollegeDashboard />} />
          <Route path="mentors" element={<MentorsPage />} />
          <Route path="jobs" element={<CollegeJobsPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="collaboration" element={<CollegeCollaborationPage />} />
          <Route path="admin-settings" element={<CollegeAdminSettingsPage />} />
        </Route>

        {/* ---------- Fallback ---------- */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
