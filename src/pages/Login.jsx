import React from "react";
import { Link } from "react-router-dom";
import TextInput from "../components/TextInput";


const Login = () => {
  return (
    <div className="auth-page">
      {/* Navbar */}
      {/* <header className="auth-navbar">
        <div className="nav-left">
          <img
            src="/src/assets/H_logo.png"
            alt="CampusHire Logo"
            className="nav-mini-logo"
          />
          <span className="nav-title"></span>
        </div>

        
      </header> */}


      {/* Centered Card */}
      <div className="auth-center">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="/src/assets/logo.png" alt="CampusHire Logo" />
          </div>

          <h2>Welcome to CampusHire</h2>
          <p className="auth-subtitle">
            Sign in to your account to continue
          </p>

          <TextInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            required
          />

          <TextInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
          />

          <div className="auth-forgot">Forgot password?</div>

          <button className="auth-btn">Sign in</button>

          <p className="auth-footer">
            Don’t have an account?{" "}
            <Link to="/register" className="auth-register-link">
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
