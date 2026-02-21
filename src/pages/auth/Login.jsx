

import React, { useState } from "react";
import TextInput from "../../components/TextInput";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(""); // ✅ NEW
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setServerError(""); // ✅ clear backend error while typing

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setServerError("");

      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // remove if not using cookies
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Incorrect email or password");
        return;
      }

      // ✅ Store token
      const token =
        data?.token ||
        data?.data?.token ||
        data?.data?.accessToken ||
        data?.accessToken;

      if (token) {
        localStorage.setItem("token", token);
      }

      // ✅ Store user
      if (data?.data) {
        localStorage.setItem("user", JSON.stringify(data.data));
      }

      // ✅ Role based navigation
      const role = data?.data?.role;

      if (role === "student") navigate("/student");
      else if (role === "companyAdmin") navigate("/company");
      else if (role === "collegeAdmin") navigate("/college");
      else navigate("/");

    } catch (error) {
      console.error("Login error:", error);
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-center">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="/src/assets/images/logo.png" alt="CampusHire Logo" />
          </div>

          <h2>Welcome to CampusHire</h2>
          <p className="auth-subtitle">
            Sign in to your account to continue
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
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              error={errors.password}
              showPasswordToggle={true}
              togglePassword={() => setShowPassword(!showPassword)}
            />

            {/* ✅ SERVER ERROR MESSAGE */}
            {serverError && (
              <div className="auth-error">
                {serverError}
              </div>
            )}

            <div className="auth-forgot">Forgot password?</div>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

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