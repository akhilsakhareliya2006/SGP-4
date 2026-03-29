import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* ---------- Helpers (Keeping your existing logic) ---------- */
function getInitials(name) {
  if (!name) return "EM";
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("");
}

function getAvatarColor(name) {
  const colors = [
    { bg: "#e0e7ff", text: "#4f46e5" }, { bg: "#dcfce7", text: "#166534" },
    { bg: "#fce7f3", text: "#be185d" }, { bg: "#fef3c7", text: "#b45309" },
    { bg: "#e0f2fe", text: "#0369a1" },
  ];
  const charCode = name ? name.charCodeAt(0) : 0;
  return colors[charCode % colors.length];
}

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  try {
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) return date.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' });
    return timeString;
  } catch (e) { return timeString; }
};

function EmployeeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------- OPTIMIZED FETCH PATTERN ---------- */
  const fetchEmployeeDetails = useCallback(async (signal = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/api/company/employee/${id}`, { 
        signal, // Added signal here
        credentials: "include" 
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch employee details");
      }

      setEmployee(data.data);
    } catch (err) {
      if (err.name === 'AbortError') return; // Pattern: Ignore intentional aborts
      console.error("Employee details fetch error:", err);
      setError(err.message);
    } finally {
      // Pattern: Only stop loading if this was the latest request
      if (!signal || !signal.aborted) setIsLoading(false);
    }
  }, [apiUrl, id]);

  useEffect(() => {
    const controller = new AbortController();
    fetchEmployeeDetails(controller.signal);
    
    return () => controller.abort(); // Cleanup on unmount or ID change
  }, [fetchEmployeeDetails]);

  // UX Improvement: If error, show it properly
  if (error) {
    return (
      <div className="empty-state" style={{ color: "#ef4444", marginTop: "4rem", textAlign: 'center' }}>
        <h3>Oops!</h3>
        <p>{error}</p>
        <button className="btn-outline" onClick={() => navigate(-1)} style={{ marginTop: "1rem" }}>
          Go Back
        </button>
      </div>
    );
  }

  const user = employee?.user || {};
  const avatarColors = getAvatarColor(user.name);

  return (
    <div className="employees-page" style={{ minHeight: "100vh", paddingBottom: "10vh" }}>
      
      {/* ================= HEADER (Always Visible) ================= */}
      <div className="employees-header" style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button
          onClick={() => navigate(-1)}
          className="back-button"
          style={{ 
            background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", 
            width: "40px", height: "40px", cursor: "pointer", color: "#475569"
          }}
        >
          ←
        </button>
        <div>
          <h2 className="page-title">Employee Profile</h2>
          {isLoading && !employee ? (
            <p className="page-subtitle">Fetching details...</p>
          ) : (
            <p className="page-subtitle">
              Viewing details for <strong>{user.name}</strong>
            </p>
          )}
        </div>
      </div>

      {isLoading && !employee ? (
        <div className="dashboard-loading" style={{ marginTop: '2rem' }}>Loading profile...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
          
          {/* ================= LEFT COLUMN: PROFILE CARD ================= */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div className="card" style={{ padding: "3rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div style={{
                width: "100px", height: "100px", borderRadius: "50%", marginBottom: "1.5rem",
                backgroundColor: avatarColors.bg, color: avatarColors.text, display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: "bold"
              }}>
                {getInitials(user.name)}
              </div>
              
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.8rem", color: "#0f172a" }}>{user.name}</h3>
              <p style={{ margin: "0 0 1.5rem 0", color: "#64748b" }}>{user.email}</p>

              <div style={{ width: "100%", borderTop: "1px solid #f1f5f9", paddingTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>System User ID</p>
                  <p style={{ margin: 0, fontWeight: "500", color: "#334155", fontFamily: "monospace" }}>{user.id || "N/A"}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Account Created</p>
                  <p style={{ margin: 0, fontWeight: "500", color: "#334155" }}>{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: INTERVIEWS CARD ================= */}
          <div className="card" style={{ display: "flex", flexDirection: "column", maxHeight: "80vh" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.2rem" }}>🗓️ Assigned Interviews</h3>
              <span style={{ backgroundColor: "#f1f5f9", padding: "4px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold" }}>
                {employee?.interviews?.length || 0} Total
              </span>
            </div>

            <div style={{ overflowY: "auto", flexGrow: 1, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "#f8fafc" }}>
              {!employee?.interviews?.length ? (
                <div className="empty-state" style={{ padding: "3rem", textAlign: "center", border: "1px dashed #cbd5e1", borderRadius: "8px", backgroundColor: "#fff" }}>
                  <p style={{ color: "#64748b" }}>No interviews assigned yet.</p>
                </div>
              ) : (
                employee.interviews.map((interview) => (
                  <InterviewItem key={interview.id} interview={interview} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for cleaner mapping
function InterviewItem({ interview }) {
  let statusConfig = { bg: "#fefce8", color: "#854d0e", label: "Pending Evaluation" };
  if (interview.selected === true) statusConfig = { bg: "#dcfce7", color: "#166534", label: "Selected" };
  if (interview.selected === false) statusConfig = { bg: "#fee2e2", color: "#991b1b", label: "Rejected" };

  return (
    <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <h4 style={{ margin: "0 0 0.25rem 0" }}>{formatDate(interview.date)}</h4>
          <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>⏰ {formatTime(interview.time)}</p>
        </div>
        <span style={{ backgroundColor: statusConfig.bg, color: statusConfig.color, padding: "4px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "bold" }}>
          {statusConfig.label}
        </span>
      </div>
      <div style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "8px" }}>
        <strong style={{ fontSize: "0.85rem", color: "#0f172a" }}>{interview.student?.college?.name || "N/A"}</strong>
        <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#64748b" }}>Roll No: {interview.student?.rollNo}</p>
      </div>
    </div>
  );
}

export default EmployeeDetailsPage;