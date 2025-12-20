import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import companyLogo from "../assets/H_logo.png";
import "../dashboard.css";
import logoutIcon from "../assets/icons/logout.png";




function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [company, setCompany] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      })

      const data = await res.json();
      setCompany(data.data)
    }
    fetchUser()
  }, [])



  const navClass = ({ isActive }) =>
    isActive ? "nav-item nav-item-active" : "nav-item";

  return (
    <div
      className={`dashboard-root ${sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
    >
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={companyLogo} alt="Company logo" />
            <div className="sidebar-company-meta">
              <span className="sidebar-company-name">Name </span>
              <span className="sidebar-company-role">Company</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-toggle-btn inside"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/dashboard/employees" className={navClass}>
            Employees
          </NavLink>
          <NavLink to="/dashboard/jobs" className={navClass}>
            Jobs
          </NavLink>
          <NavLink to="/dashboard/applications" className={navClass}>
            Applications
          </NavLink>
          <NavLink to="/dashboard/collaboration" className={navClass}>
            Collaboration
          </NavLink>
          <NavLink to="/dashboard/admin-settings" className={navClass}>
            Admin Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
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
            onClick={() => setUserMenuOpen((prev) => !prev)}
          >
            <span className="topbar-avatar">AD</span>
            <div className="topbar-user-info">
              <div className="topbar-name">Name</div>
              <div className="topbar-role">Admin</div>
            </div>
            {userMenuOpen && (
              <div className="user-menu">
                <button
                  type="button"
                  className="user-menu-item"
                  onClick={async (e) => {
                    e.stopPropagation(); // important
                    const res = await fetch("http://localhost:5000/api/auth/logout", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                    });

                    const data = await res.json();
                    if (!res.ok) {
                      alert(data.message || "Logout failed");
                      return;
                    }
                    window.location.href = "/login";
                  }}
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;



