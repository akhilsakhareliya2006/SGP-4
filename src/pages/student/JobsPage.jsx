import {  useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";

function JobsPage() {
  // const { student } = useOutletContext();
  const [jobs,setJobs] = useState([])
  const [isLoading,setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {

    async function fetchJobs(){

      try{

        const data = await apiFetch("/api/student/jobs")

        setJobs(data.data || [])

      }catch(err){

        console.error(err)

      }

      setIsLoading(false)

    }

    fetchJobs()

  },[])

  if(isLoading)
    return <div className="jobs-page-clean">Loading jobs...</div>

  if(!jobs.length)
    return <div className="jobs-page-clean">No jobs available</div>

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());

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
              {/* LEFT */}
              <div className="job-info-left">
                <div className="job-title-soft">{job.title}</div>
                <div className="job-company-soft">{job.company}</div>

                {/* NEW: location + salary */}
                <div className="job-meta">
                  <div className="job-meta-row">
                    <span className="job-meta-label">Location :</span>
                    <span className="job-meta-value">{job.location}</span>
                  </div>
                  <div className="job-meta-row">
                    <span className="job-meta-label">Salary :</span>
                    <span className="job-meta-value">{job.salary}</span>
                  </div>
                </div>

              </div>

              {/* RIGHT – status only for ALL */}
              {filter === "all" && (
                <span
                  className={`status-soft ${job.status === "applied" ? "applied" : "not-applied"
                    }`}
                >
                  {job.status === "applied" ? "Applied" : "Not Applied"}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default JobsPage;
