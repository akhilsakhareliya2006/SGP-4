import { useEffect, useState } from "react";
import { useOutletContext, useNavigate, Link } from "react-router-dom";

/* ---------- Helpers ---------- */
const formatCurrency = (amount) => {
  if (!amount) return "N/A";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

function CollegeDashboard() {
  const { college } = useOutletContext();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [isLoading, setIsLoading] = useState(true);
  
  // State for dashboard data
  const [stats, setStats] = useState({
    students: 0,
    mentors: 0,
    collaborations: 0,
    pendingJobs: 0,
  });
  
  const [recentJobs, setRecentJobs] = useState([]);
  const [pendingCollabs, setPendingCollabs] = useState([]);

  /* ---------- FETCH DASHBOARD DATA ---------- */
  /* ---------- FETCH DASHBOARD DATA ---------- */
  useEffect(() => {
    // 1. Create a single controller for all 4 requests
    const controller = new AbortController();
    const options = { credentials: "include", signal: controller.signal };

    // 2. Helper to catch normal network errors but propagate AbortErrors
    const safeFetch = (url) => 
      fetch(url, options).catch(err => {
        if (err.name === 'AbortError') throw err; // Send aborts straight to the main catch block
        return null; // For normal errors, return null so Promise.all doesn't crash completely
      });

    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        // 3. Fire all 4 requests with the abort signal attached
        const [dashboardRes, jobsRes, collabsRes, mentorsRes] = await Promise.all([
          safeFetch(`${apiUrl}/api/college/dashboard`),
          safeFetch(`${apiUrl}/api/college/job/requests?filter=PENDING`),
          safeFetch(`${apiUrl}/api/college/collab/request?status=pending`),
          safeFetch(`${apiUrl}/api/college/mentors`)
        ]);

        // 4. If the user navigated away while these were downloading, stop processing!
        if (controller.signal.aborted) return;

        let pendingJobsCount = 0;
        let recentJobsList = [];
        if (jobsRes && jobsRes.ok) {
          const jobsData = await jobsRes.json();
          const jobsArray = jobsData.data?.jobRequests || jobsData.jobs || [];
          pendingJobsCount = jobsArray.length;
          recentJobsList = jobsArray.slice(0, 3);
        }
        
        let pendingCollabsList = [];
        if (collabsRes && collabsRes.ok) {
          const collabsData = await collabsRes.json();
          pendingCollabsList = (collabsData.data?.collabRequests || []).slice(0, 3);
        }
        
        let mentorsCount = 0;
        if (mentorsRes && mentorsRes.ok) {
          const mentorsData = await mentorsRes.json();
          mentorsCount = (mentorsData.data?.mentors || []).length;
        }

        let studentsCount = 0;
        let collaboratedCount = 0;
        if (dashboardRes && dashboardRes.ok) {
          const dashboardData = await dashboardRes.json();
          studentsCount = (dashboardData.data?.studentsCount || 0);
          collaboratedCount = (dashboardData.data?.collaboratedCount || 0);
        }

        // Set the aggregated state
        setStats({
          students: studentsCount, 
          mentors: mentorsCount,
          collaborations: collaboratedCount, 
          pendingJobs: pendingJobsCount,
        });
        
        setRecentJobs(recentJobsList);
        setPendingCollabs(pendingCollabsList);

      } catch (error) {
        // 5. Ignore the error if it was caused by our intentional cancellation
        if (error.name === 'AbortError') {
          console.log("Dashboard fetch aborted cleanly.");
          return;
        }
        console.error("Dashboard fetch error:", error);
      } finally {
        // 6. Only remove the loading spinner if the component is still alive
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardStats();

    // 7. Cleanup: If the user clicks a different sidebar link, kill all 4 fetches instantly
    return () => controller.abort();
  }, [apiUrl]);

  if (isLoading) {
    return (
      <div className="employees-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="dashboard-loading" style={{ fontSize: '1.2rem' }}>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="employees-page" style={{
    height: "100%",
    overflowY: "auto",
    paddingBottom: "80px"
  }}>
      
      {/* ================= HEADER ================= */}
      <div className="employees-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h2 className="page-title">Welcome back, {college?.name || "Admin"}! 👋</h2>
          <p className="page-subtitle">
            Here is what's happening across your campus placement platform today.
          </p>
        </div>
      </div>

      {/* ================= TOP STATS GRID ================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Stat Card 1 */}
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #3b82f6', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/college/students')}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🎓</div>
          <div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Total Students</p>
            <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.8rem', color: '#0f172a' }}>{stats.students}</h3>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/college/mentors')}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👨‍🏫</div>
          <div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Active Mentors</p>
            <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.8rem', color: '#0f172a' }}>{stats.mentors}</h3>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/college/collaboration')}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🤝</div>
          <div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Collaborations</p>
            <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.8rem', color: '#0f172a' }}>{stats.collaborations}</h3>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/college/jobs')}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>💼</div>
          <div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Pending Jobs</p>
            <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.8rem', color: '#0f172a' }}>{stats.pendingJobs}</h3>
          </div>
        </div>

      </div>

      {/* ================= MAIN CONTENT GRID (2 COLUMNS) ================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* LEFT COLUMN: Pending Job Approvals */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Pending Job Requests</h3>
            <Link to="/college/jobs" style={{ fontSize: '0.85rem', color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
          </div>

          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentJobs.length === 0 ? (
               <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', margin: 0 }}>
                 <p style={{ margin: 0, color: '#64748b' }}>No pending jobs requiring approval. 🎉</p>
               </div>
            ) : (
              recentJobs.map(job => (
                <div key={job.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a' }}>{job.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{job.companyName || job.company}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, color: '#10b981' }}>{formatCurrency(job.salary)}</p>
                    <button onClick={() => navigate('/college/jobs')} style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.85rem', cursor: 'pointer', padding: 0, fontWeight: 500 }}>
                      Review Job
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Pending Collaborations */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>New Collab Requests</h3>
            <Link to="/college/collaboration" style={{ fontSize: '0.85rem', color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>Manage →</Link>
          </div>

          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingCollabs.length === 0 ? (
               <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', margin: 0 }}>
                 <p style={{ margin: 0, color: '#64748b' }}>No new collaboration requests.</p>
               </div>
            ) : (
              pendingCollabs.map(collab => (
                <div key={collab.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#475569' }}>
                    {collab.company?.name ? collab.company.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a' }}>{collab.company?.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {collab.company?.address}
                    </p>
                  </div>
                  <button onClick={() => navigate('/college/collaboration')} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    Respond
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default CollegeDashboard;