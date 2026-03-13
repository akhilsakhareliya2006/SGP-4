import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";

/* ---------- Helpers ---------- */
function getInitials(name) {
  if (!name) return "ST";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

function StudentsPage() {
  const { college } = useOutletContext();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [selectedFile, setSelectedFile] = useState(null);
  const [students, setStudents] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  /* ---------- FETCH STUDENTS ---------- */
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/student`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch students");
      }

      setStudents(data?.data || []);
    } catch (err) {
      console.error("Students fetch error:", err);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  /* ---------- FILE CHANGE & DRAG/DROP ---------- */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  /* ---------- UPLOAD ---------- */
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true);

    try {
      const res = await fetch(`${apiUrl}/api/student/upload`, {
        method: "POST",
        credentials: "include",
        body: formData, 
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      alert("Students uploaded successfully!");
      setSelectedFile(null);
      fetchStudents(); 
      
    } catch (err) {
      console.error(err);
      alert(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    // ✅ FIXED: Added minHeight: '120vh' and paddingBottom: '10vh' to force main page scrollability
    <div className="employees-page" style={{ minHeight: '120vh', paddingBottom: '10vh' }}>
      
      {/* ================= HEADER ================= */}
      <div className="employees-header">
        <div>
          <h2 className="page-title">Students</h2>
          <p className="page-subtitle">
            Manage students for <span style={{ fontWeight: 600 }}>{college?.name}</span>
          </p>
        </div>
      </div>

      {/* ================= UPLOAD ZONE ================= */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>
          Bulk Upload Students (Excel/CSV)
        </h3>

        <div className="upload-section" style={{ display: 'flex', gap: '2rem', alignItems: 'stretch' }}>
          
          <div
            className={`drop-zone ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              flex: 1,
              border: dragActive ? '2px dashed #4f46e5' : '2px dashed #cbd5e1',
              backgroundColor: dragActive ? '#f8fafc' : '#ffffff',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => document.getElementById('student-file-upload').click()}
          >
            <div className="drop-content">
              <img
                src="https://img.icons8.com/color/48/microsoft-excel-2019.png"
                alt="excel"
                style={{ marginBottom: '10px' }}
              />
              <p style={{ margin: 0, color: '#64748b' }}>
                {selectedFile ? (
                  <strong style={{ color: '#0f172a' }}>{selectedFile.name}</strong>
                ) : (
                  "Drag & drop Excel file here, or click to browse"
                )}
              </p>
            </div>
            <input
              id="student-file-upload"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: '150px' }}>
             <button
              className="btn-primary"
              onClick={handleUpload}
              disabled={isUploading || !selectedFile}
              style={{ width: '100%', padding: '0.75rem', opacity: (!selectedFile || isUploading) ? 0.6 : 1 }}
            >
              {isUploading ? "Uploading..." : "Upload File"}
            </button>
            {selectedFile && (
              <button 
                onClick={() => setSelectedFile(null)} 
                style={{ background: 'none', border: 'none', color: '#ef4444', marginTop: '10px', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Clear Selection
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ================= STUDENTS TABLE ================= */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', maxHeight: '55vh', marginBottom: '4rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem', flexShrink: 0 }}>
          Uploaded Students ({students.length})
        </h3>

        {isLoading ? (
          <div className="dashboard-loading" style={{ flexGrow: 1 }}>Loading students...</div>
        ) : students.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem', textAlign: 'center', color: '#64748b', flexGrow: 1 }}>
            No students have been uploaded yet.
          </div>
        ) : (
          <div style={{ overflowY: 'auto', flexGrow: 1, border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="employees-table" style={{ width: '100%', borderCollapse: 'collapse', margin: 0 }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8fafc', zIndex: 1, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Student Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Email</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Roll No</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', borderBottom: '1px solid #e2e8f0' }}>Branch</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.user?.id || s.rollNo} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="table-employee">
                        <span className="table-avatar">
                          {getInitials(s.user?.name)}
                        </span>
                        {s.user?.name || "Unknown"}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{s.user?.email || "—"}</td>
                    <td style={{ padding: '12px 16px' }}>{s.rollNo || "—"}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: '#f1f5f9',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        color: '#475569'
                      }}>
                        {s.branch || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentsPage;