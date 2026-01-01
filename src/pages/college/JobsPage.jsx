import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

function CollegeJobsPage() {
  const { college } = useOutletContext();

  const [jobs, setJobs] = useState([]);
  const [mentors, setMentors] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("PENDING");

  const [selectedJob, setSelectedJob] = useState(null);
  const [mentor, setMentor] = useState("");

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

  /* 🔴 IMPORTANT FIX: do NOT refetch while modal is open */
  useEffect(() => {
    if (selectedJob) return;
    fetchJobs();
  }, [filter, apiUrl, selectedJob]);

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

  /* ---------------- REJECT JOB ---------------- */
  const rejectJobHandler = async (jobId) => {
    // ✅ 1. Remove job from UI immediately
    setJobs((prev) => prev.filter((j) => j.id !== jobId));

    try {
      const res = await fetch(
        `${apiUrl}/api/college/job/${jobId}/0`,
        { method: "POST", credentials: "include" }
      );

      if (!res.ok) {
        // ❌ rollback if API fails
        fetchJobs();
      }
    } catch (err) {
      console.error(err.message);
      fetchJobs(); // rollback on error
    }
  };


  /* ---------------- APPROVE JOB ---------------- */
  const approveAndOpenModal = (job) => {
  // ✅ 1. OPEN MODAL IMMEDIATELY (NO ASYNC)
  setSelectedJob({ ...job, status: "ASSIGN_MENTOR" });

  // optional UX
  setFilter("ASSIGN_MENTOR");

  // ✅ 2. Fire-and-forget backend approval
  (async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/college/job/${job.id}/1`,
        { method: "POST", credentials: "include" }
      );

      if (!res.ok) return;

      // ✅ 3. Update job locally AFTER modal is open
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? { ...j, status: "ASSIGN_MENTOR" }
            : j
        )
      );
    } catch (err) {
      console.error(err.message);
    }
  })();
};


  /* ---------------- ASSIGN MENTOR ---------------- */
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

      // job moves to CURRENT (remove from ASSIGN_MENTOR)
      setJobs((prev) =>
        prev.filter((j) => j.id !== selectedJob.id)
      );

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

      {/* ---------------- MODAL ---------------- */}
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
