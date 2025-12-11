import React, { useState } from "react";
import TextInput from "../components/TextInput.jsx";

const CollegeRegister = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

    // Required fields
    if (!form.name.trim()) newErrors.name = "College name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    if (!form.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required";

    // Password match
    if (
      form.password.trim() &&
      form.confirmPassword.trim() &&
      form.password !== form.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // phone is optional → but if user enters, quick check
    if (form.phone && form.phone.length < 10) {
      newErrors.phone = "Phone number looks too short";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // TODO: API call later: POST /api/college/register
    console.log("College Registration:", form);
    alert("College registration form submitted (frontend only now)");
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>College Registration</h2>
        <p className="card-subtitle">
          Register your college to collaborate with companies on CampusHire.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <TextInput
            label="College Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter college name"
            required
            error={errors.name}
          />

          <TextInput
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter college address"
            required
            error={errors.address}
          />

          <TextInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter official email"
            required
            error={errors.email}
          />

          <TextInput
            label="Phone (optional)"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter contact number (optional)"
            error={errors.phone}
          />

          <TextInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
            error={errors.password}
          />

          <TextInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            required
            error={errors.confirmPassword}
          />

          <button type="submit" className="btn-primary">
            Register College
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollegeRegister;
