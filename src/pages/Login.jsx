import React, { useState } from "react";
import TextInput from "../components/TextInput.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate=useNavigate()
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true if no errors
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
          Login as company / college / student (later we can separate).
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            error={errors.email}
          />

          <TextInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            error={errors.password}
          />

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
