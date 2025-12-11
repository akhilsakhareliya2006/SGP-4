import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="logo-text">CampusHire</span>
      </div>
      <div className="nav-right">
        <Link to="/login" className={isActive("/login")}>
          Login
        </Link>
        <Link to="/register/college" className={isActive("/register/college")}>
          College Register
        </Link>
        <Link to="/register/company" className={isActive("/register/company")}>
          Company Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
