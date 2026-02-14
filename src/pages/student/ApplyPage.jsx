import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function ApplyPage() {
  const { student } = useOutletContext();

  const [search, setSearch] = useState("");

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Solutions Pvt Ltd",
      location: "Bangalore, India",
      salary: "₹6–8 LPA",
      dueDate: "30 Sep 2026",
    },
    {
      id: 2,
      title: "Backend Developer",
      company: "Innovate Labs",
      location: "Pune, India",
      salary: "₹5–7 LPA",
      dueDate: "15 Oct 2026",
    },
    {
      id: 3,
      title: "Full Stack Engineer",
      company: "CloudWorks",
      location: "Remote",
      salary: "₹7–10 LPA",
      dueDate: "10 Oct 2026",
    },
    {
      id: 4,
      title: "UI Engineer",
      company: "NextGen Systems",
      location: "Ahmedabad, India",
      salary: "₹4–6 LPA",
      dueDate: "10 Oct 2026",
    },
  ];

  // SEARCH LOGIC
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="apply-page">
      <h2 className="page-title">Apply for Jobs</h2>

      {/* SEARCH */}
      <input
        className="jobs-search-input"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* SCROLLABLE LIST */}
      <div className="job-list">
        {filteredJobs.length === 0 ? (
          <p style={{ color: "#64748b" }}>No jobs found.</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="job-card-gradient">
              {/* LEFT */}
              <div className="job-left">
                <div className="job-title">{job.title}</div>
                <div className="job-company">{job.company}</div>

                <div className="job-info">
                  <div className="info-row">
                    <span className="info-label">Location:</span>
                    <span className="info-value">{job.location}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Salary:</span>
                    <span className="info-value">{job.salary}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Last Date:</span>
                    <span className="info-value">{job.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="job-right">
                <button className="apply-btn-gradient">Apply</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ApplyPage;
