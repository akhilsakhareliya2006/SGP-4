import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

/* ---------- Helpers ---------- */
function getInitials(name) {
  if (!name) return "M";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

function MentorDetailsPage() {
  const { id } = useParams(); // Grabs the mentorId from the URL
  const navigate = useNavigate();
  const { college } = useOutletContext();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [mentor, setMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters: "all" (empty string for backend), "jobs_current", "jobs_past"
  const [filter, setFilter] = useState(""); 

  /* ---------- FETCH MENTOR DETAILS ---------- */
  const fetchMentorDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Assuming your route is under /api/college/mentor/:mentorId
      const queryParam = filter ? `?filter=${filter}` : "";
      const res = await fetch(`${apiUrl}/api/college/mentor/${id}${queryParam}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch mentor details");
      }

      setMentor(data.data);
    } catch (err) {
      console.error("Mentor details fetch error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, id, filter]);

  useEffect(() => {
    fetchMentorDetails();
  }, [fetchMentorDetails]);

  if (isLoading && !mentor) {
    return <div className="dashboard-loading">Loading mentor details...</div>;
  }

  if (error) {
    return (
      <div className="empty-state" style={{ color: '#ef4444' }}>
        <h3>Oops!</h3>
        <p>{error}</p>
        <button className="btn-outline" onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
          Go Back
        </button>
      </div>
    );
  }

  if (!mentor) return null;

  return (
    <div className="employees-page"> {/* Reusing base page layout container */}
      
      {/* ================= HEADER WITH BACK BUTTON ================= */}
      <div className="employees-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={() => navigate('/college/mentors')} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#64748b' }}
        >
          ←
        </button>
        <div>
          <h2 className="page-title">Mentor Profile</h2>
          <p className="page-subtitle">
            Viewing details for <strong>{mentor.name}</strong>
          </p>
        </div>
      </div>

      {/* ================= MENTOR INFO CARD ================= */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#4f46e5',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          {getInitials(mentor.name)}
        </div>
        
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#0f172a' }}>{mentor.name}</h3>
          <p style={{ margin: 0, color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span><strong>Email:</strong> {mentor.email}</span>
            <span><strong>Mentor ID:</strong> {mentor.id}</span>
            <span><strong>System User ID:</strong> {mentor.userId}</span>
          </p>
        </div>
      </div>

      {/* ================= ASSIGNED JOBS SECTION ================= */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Assigned Jobs</h3>
          
          {/* FILTER CHIPS */}
          <div className="filter-tabs" style={{ margin: 0 }}>
            <button
              className={`filter-pill ${filter === "" ? "active" : ""}`}
              onClick={() => setFilter("")}
            >
              All Jobs
            </button>
            <button
              className={`filter-pill ${filter === "jobs_current" ? "active" : ""}`}
              onClick={() => setFilter("jobs_current")}
            >
              Current
            </button>
            <button
              className={`filter-pill ${filter === "jobs_past" ? "active" : ""}`}
              onClick={() => setFilter("jobs_past")}
            >
              Past
            </button>
          </div>
        </div>

        {/* JOBS LIST */}
        {isLoading ? (
          <p style={{ color: '#64748b' }}>Refreshing jobs...</p>
        ) : !mentor.jobs || mentor.jobs.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem', textAlign: 'center' }}>
            No jobs assigned to this mentor for the selected filter.
          </div>
        ) : (
          <div className="jobs-cards-clean" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {mentor.jobs.map((job) => (
              <div key={job.id} className="job-card-soft" style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div className="job-title-soft" style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                  {job.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Job ID: {job.id.slice(0, 8)}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default MentorDetailsPage;