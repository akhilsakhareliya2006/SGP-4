import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      {/* Left */}
      <div className="nav-left">
        <span className="logo-text">CampusHire</span>
      </div>

      {/* Right */}
      <div className="nav-right">
        <Link to="/login" className={isActive("/login")}>
          Login
        </Link>

        <Link to="/register" className="nav-link nav-register">
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
