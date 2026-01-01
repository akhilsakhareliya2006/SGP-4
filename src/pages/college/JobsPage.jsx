import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

function CollegeJobsPage() {
  const { college } = useOutletContext();

  const [jobs, setJobs] = useState([]);
  const [mentors, setMentors] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("PENDING");

  const [selectedJob, setSelectedJob] = useState(null);
  const [mentor, setMentor] = useState(""); // mentorId

  const apiUrl = import.meta.env.VITE_API_URL;

  /* ---------------- FETCH JOBS ---------------- */
  const fetchJobs = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/college/job/requests?filter=${filter}`,
        { credentials: "include" }
      );

      if (!res.ok) return;

      const data = await res.json();
      const jobsFromApi = data.data || data.jobs || [];

      setJobs(
        jobsFromApi.map((job) => ({
          id: job.id,
          title: job.title,
          company: job.companyName,
          salary: job.salary,
          deadline: job.deadline,
          status: job.status,
          mentor: job.mentorName || null,
        }))
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filter, apiUrl]);

  /* ---------------- FETCH MENTORS ---------------- */
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/college/mentors`, {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();
        const mentorsFromApi = data.data || data.mentors || [];

        setMentors(
          mentorsFromApi.map((m) => ({
            id: m.id,
            name: m.name,
          }))
        );
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchMentors();
  }, [apiUrl]);

  /* ---------------- FILTER ---------------- */
  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (job) =>
        job.status === filter &&
        job.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [jobs, filter, search]);

  /* ---------------- REJECT JOB (0) ---------------- */
  const rejectJobHandler = async (jobId) => {
    try {
      const res = await fetch(
        `${apiUrl}/api/college/job/${jobId}/0`,
        { method: "POST", credentials: "include" }
      );

      if (!res.ok) return;

      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      console.error(err.message);
    }
  };

  /* ---------------- APPROVE JOB (1) – PENDING ONLY ---------------- */
  const approveAndOpenModal = async (job) => {
    try {
      const res = await fetch(
        `${apiUrl}/api/college/job/${job.id}/1`,
        { method: "POST", credentials: "include" }
      );

      if (!res.ok) return;

      setSelectedJob(job);
    } catch (err) {
      console.error(err.message);
    }
  };

  /* ---------------- ASSIGN MENTOR ONLY ---------------- */
  const assignMentorHandler = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/college/job/${selectedJob.id}/assign-mentor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ mentorId: mentor }),
        }
      );

      if (!res.ok) return;

      setJobs((prev) => prev.filter((j) => j.id !== selectedJob.id));
      setSelectedJob(null);
      setMentor("");
    } catch (err) {
      console.error(err.message);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="jobs-page">
      <h2 className="page-title">Jobs</h2>

      <input
        className="search-input"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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

      <div className="jobs-list">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-left">
              <div className="job-logo">
                <span>{job.company.charAt(0)}</span>
              </div>

              <div className="job-info">
                <h4>{job.title}</h4>
                <p>{job.company}</p>
                <p>Salary: {job.salary}</p>
                <p>Deadline: {job.deadline}</p>

                {job.mentor && (
                  <p>
                    Mentor: <strong>{job.mentor}</strong>
                  </p>
                )}
              </div>
            </div>

            <div className="job-actions">
              {job.status === "PENDING" && (
                <>
                  <button
                    className="btn-success"
                    onClick={() => approveAndOpenModal(job)}
                  >
                    ✓
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => rejectJobHandler(job.id)}
                  >
                    ✕
                  </button>
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
              {mentors.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <div className="modal-footer">
              <button
                className="btn-outline"
                onClick={() => {
                  setSelectedJob(null);
                  setMentor("");
                  fetchJobs();
                }}
              >
                Later
              </button>
              <button
                className="btn-primary"
                disabled={!mentor}
                onClick={assignMentorHandler}
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
