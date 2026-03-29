import { useEffect, useState, useCallback } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import studentLogo from "../../assets/images/H_logo.png";
import "../../dashboard.css";

import logoutIcon from "../../assets/icons/logout.png";
import gridIcon from "../../assets/icons/grid.png";
import listIcon from "../../assets/icons/list.png";
import exportIcon from "../../assets/icons/export.png";
import { apiFetch } from "../../utils/api";

import CompleteProfilePage from "./CompleteProfilePage";

/* ================= HELPER ================= */
function getInitials(name) {
  if (!name) return "ST";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

/* ================= LAYOUT ================= */
function SideNavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();

  /* -------- Fetch Student -------- */
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await apiFetch("/api/auth/me");
        
        let userData = res.data;
        if (userData && userData.data) {
          userData = userData.data;
        }

        console.log("👉 DEBUG - Fetched Student:", userData); 
        
        setStudent(userData);
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSession();
  }, [navigate]);

  /* -------- Context Update Function -------- */
  // 👈 NEW: Safely merges new data into the global student state
  const updateStudent = useCallback((newData) => {
    setStudent(prev => {
      if (!prev) return prev;
      
      // Deep merge if the update includes the nested 'student' object
      if (newData.student) {
        return {
          ...prev,
          ...newData,
          student: {
            ...prev.student,
            ...newData.student
          }
        };
      }
      
      // Otherwise, standard merge
      return { ...prev, ...newData };
    });
  }, []);

  /* -------- Logout -------- */
  const handleLogout = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) navigate("/login");
      else alert("Logout failed");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const navClass = ({ isActive }) =>
    isActive ? "nav-item nav-item-active" : "nav-item";

  /* ================= RENDER GUARDS ================= */
  if (isLoading) {
    return <div className="dashboard-loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Student Panel...</div>;
  }

  if (!student) {
    return null; 
  }

  if (student.hasCompletedProfile === false) {
    return (
      <CompleteProfilePage 
        onComplete={() => {
          // You could optionally use updateStudent({ hasCompletedProfile: true }) here 
          // instead of reloading if you want a smoother transition!
          window.location.reload(); 
        }} 
      />
    );
  }

  /* ================= STANDARD MAIN LAYOUT ================= */
  return (
    <div
      className={`dashboard-root ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={studentLogo} alt="Student logo" />
            <div className="sidebar-company-meta">
              <span className="sidebar-company-name">
                {student.name}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-toggle-btn inside"
            onClick={() => setSidebarOpen((p) => !p)}
          >
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/student/dashboard" end className={navClass}>
            <img src={gridIcon} className="nav-icon" alt="" />
            <span className="nav-label">Dashboard</span>
          </NavLink>

          <NavLink to="/student/apply" className={navClass}>
            <img src={exportIcon} className="nav-icon" alt="" />
            <span className="nav-label">Apply</span>
          </NavLink>

          <NavLink to="/student/jobs" className={navClass}>
            <img src={listIcon} className="nav-icon" alt="" />
            <span className="nav-label">Jobs</span>
          </NavLink>

          <NavLink to="/student/applications" className={navClass}>
            <img src={listIcon} className="nav-icon" alt="" />
            <span className="nav-label">Applications</span>
          </NavLink>

          <NavLink to="/student/mentor-approved" className={navClass}>
            <img src={gridIcon} className="nav-icon" alt="" />
            <span className="nav-label">Mentor Approved</span>
          </NavLink>

          <NavLink to="/student/profile" className={navClass}>
            <img src={exportIcon} className="nav-icon" alt="" />
            <span className="nav-label">Profile</span>
          </NavLink>
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            {!sidebarOpen && (
              <button
                type="button"
                className="sidebar-toggle-btn"
                onClick={() => setSidebarOpen(true)}
              >
                ☰
              </button>
            )}
          </div>

          <div
            className="topbar-user"
            onClick={() => setUserMenuOpen((p) => !p)}
          >
            <span className="topbar-avatar">
              {getInitials(student.name)}
            </span>

            <div className="topbar-user-info">
              <div className="topbar-name">{student.name}</div>
              <div className="topbar-role">
                ID: {student.metadata?.rollNo || "—"}
              </div>
            </div>

            {userMenuOpen && (
              <div className="user-menu">
                <button
                  type="button"
                  className="user-menu-item"
                  onClick={handleLogout}
                >
                  <img
                    src={logoutIcon}
                    alt="Logout"
                    className="user-menu-icon"
                  />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="content-wrapper">
          {/* 👈 NEW: Passing updateStudent down to all child pages */}
          <Outlet context={{ student, updateStudent }} />
        </main>
      </div>
    </div>
  );
}

export default SideNavBar;