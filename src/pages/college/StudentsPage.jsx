import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function StudentsPage() {
  const { college } = useOutletContext();

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select an Excel file");
      return;
    }

    // Backend integration later
    console.log("File:", file);

    alert("Student file uploaded (demo)");
  };

  return (
    <div className="college-students-page">
      <h2 className="page-heading">Students</h2>

      {/* Upload Card */}
      <div className="upload-card">
        <h3 className="upload-title">Upload Student Excel</h3>

        {/* File Input */}
        <div className="form-group">
          <label className="form-label">Select Excel File</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            className="form-input"
            onChange={handleFileChange}
          />
        </div>

        {/* Upload Button */}
        <button className="upload-btn" onClick={handleUpload}>
          Upload Students
        </button>
      </div>
    </div>
  );
}

export default StudentsPage;
