import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

/* ---------- Status Badge ---------- */
function StatusBadge({ status, onAccept, onReject }) {
  // Only show icons when request is coming
  if (status !== "REQUEST") return null;

  return (
    <div className="request-actions">
      <span className="icon accept" onClick={onAccept}>✔</span>
      <span className="icon reject" onClick={onReject}>✖</span>
    </div>
  );
}




/* ---------- Mock Data (replace with API later) ---------- */
const MOCK_COMPANIES = [
  {
    id: 1,
    name: "TechNova Pvt Ltd",
    address: "Ahmedabad, Gujarat",
    status: "REQUEST",
  },

  {
    id: 2,
    name: "InnoSoft Solutions",
    address: "Pune, Maharashtra",
    status: "COLLABORATED",
  },

  {
    id: 3,
    name: "CodeCrafters",
    address: "Bangalore, Karnataka",
    status: "REJECTED",
  },
];

function getInitial(name) {
  return name?.charAt(0)?.toUpperCase() || "?";
}

/* ---------- Page ---------- */
function CollegeCollaborationPage() {
  const { college } = useOutletContext();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filteredCompanies = useMemo(() => {
    return MOCK_COMPANIES.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.address.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "ALL" || c.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="collaboration-page">
      {/* Header */}
      <div className="employees-header">
        <div>
          <h2 className="page-title">Collaboration</h2>
          <p className="page-subtitle">
            Manage collaboration requests for{" "}
            <strong>{college?.name}</strong>
          </p>
        </div>
      </div>

      {/* Search */}
      <input
        className="search-input collab-search"
        placeholder="Search company by name or address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filters */}
      <div className="filter-tabs">
        {[, "REQUEST", "COLLABORATED", "REJECTED"].map((item) => (
          <button
            key={item}
            className={`filter-pill ${
              filter === item ? "active" : ""
            }`}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="collab-list">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="collab-card">
            <div className="collab-left">
              <div className="collab-logo">
                {getInitial(company.name)}
              </div>

              <div>
                <div className="collab-name">{company.name}</div>
                <div className="collab-address">
                  {company.address}
                </div>
              </div>
            </div>

            <div className="collab-right">
              <StatusBadge status={company.status} />
            </div>
          </div>
        ))}

        {filteredCompanies.length === 0 && (
          <div className="empty-state">
            No collaboration records found.
          </div>
        )}
      </div>
    </div>
  );
}

export default CollegeCollaborationPage;
