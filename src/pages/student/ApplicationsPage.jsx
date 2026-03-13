import { useEffect, useState } from "react";
// import { useOutletContext } from "react-router-dom";
import { apiFetch } from "../../utils/api";

function ApplicationsPage() {
  // const { student } = useOutletContext();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [applications,setApplications] = useState([])
  const [isLoading,setIsLoading] = useState(true)

  useEffect(()=>{

    async function fetchApplications(){

      try{

        const data = await apiFetch("/api/student/applications")

        setApplications(data.data || [])

      }catch(err){

        console.error(err)

      }

      setIsLoading(false)

    }

    fetchApplications()

  },[])

  if(isLoading)
    return <div>Loading applications...</div>

  if(!applications.length)
    return <div>No applications yet</div>

  // SEARCH + FILTER
  const filteredApplications = applications.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" || item.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="jobs-page-clean">
      <h2 className="jobs-heading">Applications</h2>

      {/* Search */}
      <input
        className="jobs-search-input"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filters */}
      <div className="jobs-filters-clean">
        {["all", "pending", "shortlisted", "hired", "rejected"].map((f) => (
          <button
            key={f}
            className={`filter-chip ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="jobs-cards-clean">
        {filteredApplications.length === 0 ? (
          <p style={{ color: "#64748b" }}>No applications found.</p>
        ) : (
          filteredApplications.map((item) => (
            <div key={item.id} className="job-card-soft">
              {/* LEFT */}
              <div className="job-info-left">
                <div className="job-title-soft">{item.title}</div>
                <div className="job-company-soft">{item.company}</div>

                {/* ✅ Location + Salary (clean line) */}
                <div className="job-meta-column">
                  <div className="job-meta-line">
                    <span className="job-meta-label">Location:</span>
                    <span className="job-meta-value">{item.location}</span>
                  </div>

                  <div className="job-meta-line">
                    <span className="job-meta-label">Salary:</span>
                    <span className="job-meta-value">{item.salary}</span>
                  </div>
                </div>

              </div>

              {/* RIGHT */}
              {filter === "all" && (
                <span
                  className={`status-soft application-${item.status}`}
                >
                  {item.status.toUpperCase()}
                </span>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ApplicationsPage;
