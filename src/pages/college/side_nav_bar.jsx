import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import collegeLogo from "../../assets/images/H_logo.png";
import "../../dashboard.css";
import logoutIcon from "../../assets/icons/logout.png";

/* ---------- Helper ---------- */
function getInitials(name) {
  if (!name) return "CL";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

function CollegeDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [college, setCollege] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  /* ---------- Fetch Logged-in College ---------- */
  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/auth/me`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        setCollege(data.data);
      } catch (error) {
        console.error("College auth error:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollege();
  }, [navigate,apiUrl]);

  /* ---------- Logout ---------- */
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

  /* ---------- Loading Guard ---------- */
  if (isLoading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }

  if (!college) return null;

  return (
    <div
      className={`dashboard-root ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      {/* ---------- Sidebar ---------- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={collegeLogo} alt="College logo" />
            <div className="sidebar-company-meta">
              <span className="sidebar-company-name">{college.name}</span>
              <span className="sidebar-company-role">College Panel</span>
            </div>
          </div>

          <button
            className="sidebar-toggle-btn inside"
            onClick={() => setSidebarOpen((p) => !p)}
          >
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/college/dashboard" end className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/college/mentors" className={navClass}>
            Mentors
          </NavLink>
          <NavLink to="/college/jobs" className={navClass}>
            Jobs
          </NavLink>
          <NavLink to="/college/students" className={navClass}>
            Students
          </NavLink>
          <NavLink to="/college/collaboration" className={navClass}>
            Collaboration
          </NavLink>
          <NavLink to="/college/admin-settings" className={navClass}>
            Admin Settings
          </NavLink>
        </nav>
      </aside>

      {/* ---------- Main Content ---------- */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            {!sidebarOpen && (
              <button
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
              {getInitials(college.name)}
            </span>

            <div className="topbar-user-info">
              <div className="topbar-name">{college.email}</div>
              <div className="topbar-role">Admin</div>
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
          {/* College data available to all child pages */}
          <Outlet context={{ college }} />
        </main>
      </div>
    </div>
  );
}

export default CollegeDashboardLayout;
