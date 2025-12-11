import React from "react";

const TextInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
}) => {
  return (
    <div className="form-group">
      <label className="form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        className={`form-input ${error ? "input-error" : ""}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default TextInput;
