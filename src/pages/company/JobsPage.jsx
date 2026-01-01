import { useState, useMemo } from "react";

/* ---------- STATIC MOCK DATA ---------- */
const MOCK_JOBS = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechNova",
    salary: "₹15,000",
    dueDate: "2025-02-10",
    createdAt: "2025-01-05",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "InnoSoft",
    salary: "₹25,000",
    dueDate: "2025-03-01",
    createdAt: "2025-01-01",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "PixelWorks",
    salary: "₹20,000",
    dueDate: "2024-12-01",
    createdAt: "2024-11-01",
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "DataCorp",
    salary: "₹30,000",
    dueDate: "2025-01-25",
    createdAt: "2025-01-08",
  },
];

function CompanyJobsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("CURRENT");

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(
      (job) =>
        job.status === filter &&
        job.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, filter]);

  return (
    <div className="jobs-page">
      {/* Header */}
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
        {filteredJobs.length === 0 && (
          <div className="empty-state">No jobs found</div>
        )}

        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">
            {/* Left */}
            <div className="job-left">
              <div className="job-logo">
                {job.company.charAt(0)}
              </div>

              <div className="job-info">
                <h4>{job.title}</h4>
                <p className="job-company">{job.company}</p>
                <p>Salary: {job.salary}</p>
                <p>Due Date: {job.dueDate}</p>
                <p className="created-at">
                  Created: {job.createdAt}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="job-status">
              <span className={`status ${job.status.toLowerCase()}`}>
                {job.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompanyJobsPage;
