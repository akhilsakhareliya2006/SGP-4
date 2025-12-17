import React, { useState } from "react";
import TextInput from "../components/TextInput.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate=useNavigate()
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: replace with real login + role-based redirect
    navigate("/dashboard/employees");
  };

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


const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form)
      });

      const data = await res.json();  // <-- IMPORTANT

      if (!res.ok) {
        console.error("Error:", data);
        alert(data.message || "login failed");
        return;
      }

      console.log("Logged In Successfully:", data);
      alert("Logged In successfully!");

      setForm({
        email: "",
        password: "",
      });

    // 2️⃣ Redirect to login page
      if(data.data.user.role==="collegeAdmin") navigate("/college/admin", { replace: true });
      if(data.data.user.role==="student") navigate("/college/student", { replace: true });
      if(data.data.user.role==="mentor") navigate("/college/mentor", { replace: true });
      if(data.data.user.role==="companyAdmin") navigate("/company/admin", { replace: true });
      if(data.data.user.role==="employee") navigate("/company/employee", { replace: true });

    } catch (error) {
      console.error("Network error:", error);
      alert("Something went wrong!");
    }
  };


  return (
    <div className="page-container">
      <div className="card">
        <h2>Login</h2>
        <p className="card-subtitle">
          Login as company / college / student / mentor / employee.
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

          <button type="submit" className="auth-btn">
            Sign in
          </button>

          <p className="auth-footer">
            Don’t have an account?{" "}
            <Link to="/register" className="auth-register-link">
              Register
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;
