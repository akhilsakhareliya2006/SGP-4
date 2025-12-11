import React, { useState } from "react";
import TextInput from "../components/TextInput.jsx";

const Login = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // TODO: call backend API here later
    console.log("Login data:", form);
    alert("Login form submitted (frontend only now)");
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
