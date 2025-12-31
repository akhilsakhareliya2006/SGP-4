import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

/* ---------- Mock Jobs ---------- */
const MOCK_JOBS = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechNova",
    salary: "₹15,000",
    deadline: "2025-02-15",
    status: "PENDING",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "InnoSoft",
    salary: "₹25,000",
    deadline: "2025-03-01",
    status: "CURRENT",
    mentor: "Jay Patel",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "PixelWorks",
    salary: "₹20,000",
    deadline: "2024-12-01",
    status: "PAST",
    mentor: "Premal Patel",
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "DataCorp",
    salary: "₹30,000",
    deadline: "2025-01-25",
    status: "ASSIGN_MENTOR",
  },
];

const MENTORS = ["Premal Patel", "Jay Patel", "Pravin Jadav"];



/* ---------- Page ---------- */
function CollegeJobsPage() {
  const { college } = useOutletContext();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("PENDING");
  const [selectedJob, setSelectedJob] = useState(null);
  const [mentor, setMentor] = useState("");

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(
      (job) =>
        job.status === filter &&
        job.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [filter, search]);

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
        {["PENDING", "CURRENT", "PAST", "ASSIGN_MENTOR"].map((f) => (
          <button
            key={f}
            className={`filter-pill ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="jobs-list">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">

            {/* ===== LEFT SIDE ===== */}
            <div className="job-left">
              {/* Logo */}
              <div className="job-logo">
                {job.logo ? (
                  <img src={job.logo} alt={job.company} />
                ) : (
                  <span>{job.company.charAt(0)}</span>
                )}
              </div>

              {/* Job Info */}
              <div className="job-info">
                <h4 className="job-title">{job.title}</h4>
                <p className="job-company">{job.company}</p>
                <p className="job-meta">Salary: {job.salary}</p>
                <p className="job-meta">Deadline: {job.deadline}</p>

                {job.mentor && (
                  <p className="job-meta">
                    Mentor: <strong>{job.mentor}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* ===== RIGHT SIDE (ACTIONS / STATUS) ===== */}
            <div className="job-actions">
              {job.status === "PENDING" && (
                <>
                  <button
                    className="btn-success"
                    onClick={() => setSelectedJob(job)}
                  >
                    ✓ 
                  </button>
                  <button className="btn-danger">✕</button>
                </>
              )}

              {job.status === "ASSIGN_MENTOR" && (
                <button
                  className="btn-primary"
                  onClick={() => setSelectedJob(job)}
                >
                  Assign Mentor
                </button>
              )}

              
            </div>

          </div>
        ))}
      </div>


      {/* Assign Mentor Modal */}
      {selectedJob && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{selectedJob.title}</h3>
            <p>{selectedJob.company}</p>

            <select
              value={mentor}
              onChange={(e) => setMentor(e.target.value)}
            >
              <option value="">Select Mentor</option>
              {MENTORS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>

            <div className="modal-footer">
              <button
                className="btn-outline"
                onClick={() => setSelectedJob(null)}
              >
                Later
              </button>
              <button
                className="btn-primary"
                disabled={!mentor}
                onClick={() => {
                  alert(`Mentor ${mentor} assigned`);
                  setSelectedJob(null);
                }}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollegeJobsPage;
