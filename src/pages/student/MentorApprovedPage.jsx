import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function MentorApprovedPage() {
  const { student } = useOutletContext();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Temporary static data (API later)
  const approvals = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Solutions Pvt Ltd",
      status: "pending", // pending | approved | rejected
    },
    {
      id: 2,
      title: "Backend Developer",
      company: "Innovate Labs",
      status: "approved",
    },
    {
      id: 3,
      title: "Full Stack Engineer",
      company: "CloudWorks",
      status: "rejected",
    },
    {
      id: 4,
      title: "UI Engineer",
      company: "NextGen Systems",
      status: "approved",
    },
  ];

  // ✅ SEARCH + FILTER LOGIC
  const filteredApprovals = approvals.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" || item.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="jobs-page-clean">
      <h2 className="jobs-heading">Mentor Approved</h2>

      {/* Search */}
      <input
        className="jobs-search-input"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filters */}
      <div className="jobs-filters-clean">
        {["all", "pending", "approved", "rejected"].map((f) => (
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
        {filteredApprovals.length === 0 ? (
          <p style={{ color: "#64748b" }}>No records found.</p>
        ) : (
          filteredApprovals.map((item) => (
            <div key={item.id} className="job-card-soft">
              <div className="job-info-left">
                <div className="job-title-soft">{item.title}</div>
                <div className="job-company-soft">{item.company}</div>
              </div>

              <span
                className={`status-soft mentor-${item.status}`}
              >
                {item.status.toUpperCase()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MentorApprovedPage;
