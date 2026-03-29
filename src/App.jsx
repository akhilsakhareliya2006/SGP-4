import { Routes, Route, Navigate } from "react-router-dom"; // REMOVED useLocation

import Navbar from "./components/Navbar";
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
import EmployeeDetailsPage from "./pages/company/EmployeeDetailsPage";
import CompanyJobDetailsPage from "./pages/company/CompanyJobDetailsPage";
import JobPipelinePage from "./pages/company/JobPipelinePage";
import CompanyCollegeDetailsPage from "./pages/company/CompanyCollegeDetailsPage";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanySettingsPage from "./pages/company/AdminSettingsPage";

/* ---------- College ---------- */
import CollegeDashboardLayout from "./pages/college/side_nav_bar";
import CollegeDashboard from "./pages/college/DashboardPage";
import MentorsPage from "./pages/college/MentorsPage";
import CollegeJobsPage from "./pages/college/JobsPage";
import StudentsPage from "./pages/college/StudentsPage";
import CollegeCollaborationPage from "./pages/college/CollaborationPage";
import CollegeAdminSettingsPage from "./pages/college/AdminSettingsPage";
import MentorsDetailPage from "./pages/college/MentorDetailsPage";
import JobDetailsPage from "./pages/college/JobDetailsPage";
import CompanyDetailsPage from "./pages/college/CompanyDetailsPage";

/* ---------- Student ---------- */
import StudentDashboardLayout from "./pages/student/side_nav_bar";
import StudentDashboard from "./pages/student/DashboardPage";
import StudentJobsPage from "./pages/student/JobsPage";
import StudentApplicationsPage from "./pages/student/ApplicationsPage";
import StudentMentorApprovedPage from "./pages/student/MentorApprovedPage";
import ApplyPage from "./pages/student/ApplyPage";
import StudentJobDetailsPage from "./pages/student/JobDetailPage";
import ProfilePage from "./pages/student/CompleteProfilePage";

/* ---------- Mentor ---------- */
import MentorDashboardLayout from "./pages/mentor/side_nav_bar";
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorJobsPage from "./pages/mentor/Jobs";
import MentorApprovalsPage from "./pages/mentor/MentorApproval";
import MentorSettingsPage from "./pages/mentor/Profile";
import MentorStudentsPage from "./pages/mentor/Students";

/* ---------- NEW: Public Layout Wrapper ---------- */
// This wraps pages that SHOULD have the top Navbar
import { Outlet } from "react-router-dom";
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Routes>
      
      {/* ---------- Public Routes (With Top Navbar) ---------- */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterChoice />} />
        <Route path="/register/college" element={<CollegeRegister />} />
        <Route path="/register/company" element={<CompanyRegister />} />
      </Route>

      {/* ---------- Default Redirect ---------- */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ---------- Company Dashboard ---------- */}
      <Route path="/company" element={<CompanyDashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="collaboration" element={<CollaborationPage />} />
        <Route path="admin-settings" element={<AdminSettingsPage />} />
        <Route path="employees/:id" element={<EmployeeDetailsPage />} />
        <Route path="jobs/:id" element={<CompanyJobDetailsPage />} />
        <Route path="applications/:jobId" element={<JobPipelinePage />} />
        <Route path="college/:id" element={<CompanyCollegeDetailsPage />} />
        <Route path="settings" element={<CompanySettingsPage/>} />
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
        <Route path="mentors/:id" element={<MentorsDetailPage />} />
        <Route path="jobs/:id" element={<JobDetailsPage />} />
        <Route path="company/:id" element={<CompanyDetailsPage />} />
      </Route>

      {/* ---------- Student Dashboard ---------- */}
      <Route path="/student" element={<StudentDashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="apply" element={<ApplyPage />} />
        <Route path="jobs" element={<StudentJobsPage />} />
        <Route path="applications" element={<StudentApplicationsPage />} />
        <Route path="mentor-approved" element={<StudentMentorApprovedPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="job/:jobId" element={<StudentJobDetailsPage />} />
      </Route>

      {/* ---------- Mentor Dashboard -------- */}
      <Route path="/mentor" element={<MentorDashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<MentorDashboard />} />
        <Route path="approvals" element={<MentorApprovalsPage />} />
        <Route path="students" element={<MentorStudentsPage />} />
        <Route path="jobs" element={<MentorJobsPage />} />
        <Route path="profile" element={<MentorSettingsPage />} /> 
      </Route>

      {/* ---------- Fallback ---------- */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;