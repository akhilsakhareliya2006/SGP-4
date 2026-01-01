import { useState, useEffect, useMemo } from "react";


function CompanyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("CURRENT");
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  // map UI filter -> API filter
  const filterMap = {
    CURRENT: "current",
    PAST: "past",
    ACCEPTED: "accepted",
    PENDING: "pending",
  };

  // 🔹 Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${apiUrl}/api/company/jobs?filter=${filterMap[filter]}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        console.log(data.data);
        
        setJobs(data.data); // ApiResponse → data
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filter]);

  // 🔹 Frontend search
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      job.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [jobs, search]);

  return (
    <div className="jobs-page">
      <h2 className="page-title">Jobs</h2>

      {/* Search */}
      <input
        className="search-input"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filters */}
      <div className="filter-tabs">
        {["CURRENT", "PENDING", "ACCEPTED", "PAST"].map((f) => (
          <button
            key={f}
            className={`filter-pill ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="jobs-list">
        {loading && <div className="empty-state">Loading...</div>}

        {!loading && filteredJobs.length === 0 && (
          <div className="empty-state">No jobs found</div>
        )}

        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-left">
              <div className="job-logo">
                {job.college?.name?.charAt(0)}
              </div>

              <div className="job-info">
                <h4>{job.title}</h4>
                <p className="job-company">{job.college?.name}</p>
                <p>Salary: ₹{job.salary}</p>
                <p>
                  Due Date: {new Date(job.dueDate).toLocaleDateString()}
                </p>
                <p className="created-at">
                  Created: {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompanyJobsPage;
