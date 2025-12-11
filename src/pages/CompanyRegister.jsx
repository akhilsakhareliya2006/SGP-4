import React, { useState } from "react";
import TextInput from "../components/TextInput.jsx";

const CompanyRegister = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    registrationNo: "",
    contactNo: "",
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

    if (!form.name.trim()) newErrors.name = "Company name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.registrationNo.trim())
      newErrors.registrationNo = "Registration number is required";
    if (!form.contactNo.trim())
      newErrors.contactNo = "Contact number is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    if (!form.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required";

    if (
      form.password.trim() &&
      form.confirmPassword.trim() &&
      form.password !== form.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (form.contactNo && form.contactNo.length < 10) {
      newErrors.contactNo = "Contact number looks too short";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // TODO: API call later: POST /api/company/register
    console.log("Company Registration:", form);
    alert("Company registration form submitted (frontend only now)");
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Company Registration</h2>
        <p className="card-subtitle">
          Register your company to hire from colleges via CampusHire.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <TextInput
            label="Company Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter company name"
            required
            error={errors.name}
          />

          <TextInput
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter company address"
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
            label="Registration Number"
            name="registrationNo"
            value={form.registrationNo}
            onChange={handleChange}
            placeholder="Enter company registration number"
            required
            error={errors.registrationNo}
          />

          <TextInput
            label="Contact Number"
            name="contactNo"
            value={form.contactNo}
            onChange={handleChange}
            placeholder="Enter contact number"
            required
            error={errors.contactNo}
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
            Register Company
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyRegister;
