import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

function ApplyPage() {
  const { student } = useOutletContext();

  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  const token =
    student?.token ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken");

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const idempotencyKeyRef = useRef(null);

  /* ================= FETCH JOBS (NO IDEMPOTENCY) ================= */
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const headers = {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        };

        const res = await axios.get(
          `${apiUrl}/api/student/jobs`,
          { headers, withCredentials: true }
        );

        const payload = res.data?.data ?? res.data;
        setJobs(Array.isArray(payload?.jobs) ? payload.jobs : []);
      } catch (err) {
        console.log(err);
        if (err?.response?.status === 401) {
          setError("Unauthorized — please login");
          navigate("/auth/login");
          return;
        }
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /* ================= JOB DETAILS ================= */
  const handleApply = async (jobId) => {
    setDetailLoading(true);
    setSelectedJob(null);
    setShowDetail(true);

    try {
      const endpoints = [`${apiUrl}/api/student/job/${jobId}`];
      let data = null;

      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      for (const ep of endpoints) {
        try {
          const resp = await axios.get(ep, {
            headers,
            withCredentials: true,
          });
          if (resp.status >= 200 && resp.status < 300) {
            data = resp.data?.data ?? resp.data;
            break;
          }
        } catch (e) {
          if (e?.response?.status === 401) {
            setError("Unauthorized — please login");
            navigate("/auth/login");
            return;
          }
        }
      }

      if (!data) {
        const found = jobs.find((j) => String(j.id) === String(jobId));
        setSelectedJob(found || { id: jobId, title: "Unknown Job" });
      } else {
        setSelectedJob(data);
      }
    } finally {
      setDetailLoading(false);
    }
  };

  /* ================= APPLY TO JOB (IDEMPOTENT) ================= */
  const applyToJob = async (jobId) => {
    if (!jobId) {
      alert("Unable to determine job id to apply");
      return;
    }

    setApplyLoading(true);

    // ✅ generate ONCE per apply attempt
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = uuidv4();
    }

    try {
      const headers = {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKeyRef.current,
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const res = await axios.post(
        `${apiUrl}/api/student/apply/${jobId}`,
        {},
        { headers, withCredentials: true }
      );
      console.log(res);
      

      if (res.status >= 200 && res.status < 300) {
        const payload = res.data?.data ?? res.data;
        alert(payload?.message || res.data?.message || "Applied successfully");
        setShowDetail(false);

        // ✅ reset key after success
        idempotencyKeyRef.current = null;
      } else {
        alert("Apply failed");
      }
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        setError("Unauthorized — please login");
        navigate("/auth/login");
        return;
      }
      alert(err?.response?.data?.message || "Apply failed");
    } finally {
      setApplyLoading(false);
    }
  };

  /* ================= SEARCH ================= */
  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase())
  );

  const renderField = (val) => {
    if (val === null || val === undefined) return "";
    if (typeof val === "string" || typeof val === "number") return val;
    if (typeof val === "object")
      return val.name ?? val.title ?? val.companyName ?? JSON.stringify(val);
    return String(val);
  };

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className="apply-page">
      <h2 className="page-title">Apply for Jobs</h2>

      <input
        className="jobs-search-input"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="job-list">
        {loading ? (
          <p style={{ color: "#64748b" }}>Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p style={{ color: "#64748b" }}>No jobs found.</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="job-card-gradient">
              <div className="job-left">
                <div className="job-title">{renderField(job.title)}</div>
                <div className="job-company">{renderField(job.company)}</div>

                <div className="job-info">
                  <div className="info-row">
                    <span className="info-label">Location:</span>
                    <span className="info-value">
                      {renderField(job.location)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Salary:</span>
                    <span className="info-value">
                      {renderField(job.salary)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Last Date:</span>
                    <span className="info-value">
                      {renderField(job.dueDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="job-right">
                <button
                  className="apply-btn-gradient"
                  onClick={() => handleApply(job.id)}
                >
                  Apply
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showDetail && (
        <div
          className="job-detail-modal"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              width: 720,
              maxWidth: "95%",
              background: "#fff",
              borderRadius: 8,
              padding: 20,
            }}
          >
            <button
              style={{ float: "right" }}
              onClick={() => {
                setShowDetail(false);
                setSelectedJob(null);
              }}
            >
              Close
            </button>

            {detailLoading ? (
              <p>Loading details...</p>
            ) : selectedJob ? (
              <div>
                <h3 style={{ marginTop: 0 }}>
                  {renderField(selectedJob.title)}
                </h3>
                <p style={{ color: "#64748b" }}>
                  {renderField(selectedJob.company)}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {renderField(selectedJob.location)}
                </p>
                <p>
                  <strong>Salary:</strong>{" "}
                  {renderField(selectedJob.salary)}
                </p>
                <p>
                  <strong>Last Date:</strong>{" "}
                  {renderField(selectedJob.dueDate)}
                </p>

                <div style={{ marginTop: 16 }}>
                  <button
                    className="confirm-apply-btn"
                    onClick={() =>
                      applyToJob(
                        selectedJob?.id ||
                          selectedJob?._id ||
                          selectedJob?.jobId
                      )
                    }
                    disabled={applyLoading}
                  >
                    {applyLoading ? "Applying..." : "Confirm Apply"}
                  </button>
                </div>
              </div>
            ) : (
              <p>No job details available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplyPage;
