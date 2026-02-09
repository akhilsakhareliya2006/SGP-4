import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function JobsPage() {
  const { student } = useOutletContext();

  // ✅ DEFAULT FILTER
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Solutions Pvt Ltd",
      status: "not-applied",
      type: "current",
    },
    {
      id: 2,
      title: "Backend Developer",
      company: "Innovate Labs",
      status: "applied",
      type: "current",
    },
    {
      id: 3,
      title: "Full Stack Engineer",
      company: "CloudWorks",
      status: "applied",
      type: "past",
    },
     {
      id: 3,
      title: "Full Stack Engineer",
      company: "CloudWorks",
      status: "applied",
      type: "past",
    },
     {
      id: 3,
      title: "Full Stack Engineer",
      company: "CloudWorks",
      status: "applied",
      type: "past",
    },
     {
      id: 3,
      title: "Full Stack Engineer",
      company: "CloudWorks",
      status: "applied",
      type: "past",
    },
     {
      id: 3,
      title: "Full Stack Engineer",
      company: "CloudWorks",
      status: "applied",
      type: "past",
    },
     {
      id: 3,
      title: "Full Stack Engineer",
      company: "CloudWorks",
      status: "applied",
      type: "past",
    },
     {
      id: 3,
      title: "Full Stack Engineer",
      company: "CloudWorks",
      status: "applied",
      type: "past",
    },
    
  ];

  // ✅ FILTER + SEARCH LOGIC
  const filteredJobs = jobs.filter((job) => {
    // Search match
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());

    // Filter match
    const matchesFilter =
      filter === "all" ||
      (filter === "applied" && job.status === "applied") ||
      (filter === "not-applied" && job.status === "not-applied") ||
      (filter === "current" && job.type === "current") ||
      (filter === "past" && job.type === "past");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="jobs-page-clean">
      <h2 className="jobs-heading">Jobs</h2>

      {/* SEARCH */}
      <input
        className="jobs-search-input"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTERS */}
      <div className="jobs-filters-clean">
        {["all", "applied", "not-applied", "current", "past"].map((f) => (
          <button
            key={f}
            className={`filter-chip ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.replace("-", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* JOB CARDS */}
      <div className="jobs-cards-clean">
        {filteredJobs.length === 0 ? (
          <p style={{ color: "#64748b" }}>No jobs found.</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="job-card-soft">
              <div className="job-info-left">
                <div className="job-title-soft">{job.title}</div>
                <div className="job-company-soft">{job.company}</div>
              </div>

              <span
                className={`status-soft ${
                  job.status === "applied" ? "applied" : "not-applied"
                }`}
              >
                {job.status === "applied" ? "Applied" : "Not Applied"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default JobsPage;
