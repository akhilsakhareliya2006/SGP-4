import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function StudentsPage() {
  const { college } = useOutletContext();

  const [selectedFile, setSelectedFile] = useState(null);

const handleFileChange = (e) => {
  setSelectedFile(e.target.files[0]);
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

    <div className="upload-card">
      <h3 className="upload-title">Upload Student Excel</h3>

      {/* File Upload Section */}
      <div className="upload-section">

        {/* Left Side - File Input + Button */}
        <div className="left-upload">
          <label className="form-label">Select Excel File</label>

          <input
            type="file"
            accept=".xlsx,.xls"
            className="form-input"
            onChange={handleFileChange}
          />

          {selectedFile && (
            <p className="file-name">📄 {selectedFile.name}</p>
          )}

          <button className="upload-btn" onClick={handleUpload}>
            Upload
          </button>
        </div>

        {/* Right Side - Drag & Drop */}
        <div
          className="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            handleFileChange({ target: { files: [file] } });
          }}
        >
          <div className="drop-content">
            <img
              src="https://img.icons8.com/color/48/microsoft-excel-2019.png"
              alt="excel"
            />
            <p>Drag & drop file or click to browse</p>
          </div>
        </div>

      </div>
    </div>
  </div>
);
}

export default StudentsPage;
