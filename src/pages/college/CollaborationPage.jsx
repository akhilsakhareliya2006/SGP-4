import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

/* ---------- Status Badge ---------- */
function StatusBadge({ status, onAccept, onReject }) {
  if (status !== "REQUEST") return null;

  return (
    <div className="request-actions">
      <span className="icon accept" onClick={onAccept}>✔</span>
      <span className="icon reject" onClick={onReject}>✖</span>
    </div>
  );
}

/* ---------- Helpers ---------- */
function getInitial(name) {
  return name?.charAt(0)?.toUpperCase() || "?";
}

/* ---------- Status Mapping ---------- */
const STATUS_MAP = {
  pending: "REQUEST",
  accepted: "COLLABORATED",
  rejected: "REJECTED",
};

const REVERSE_STATUS_MAP = {
  REQUEST: "pending",
  COLLABORATED: "accepted",
  REJECTED: "rejected",
};

/* ---------- Page ---------- */
function CollegeCollaborationPage() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { college } = useOutletContext();

  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("REQUEST");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ---------- Fetch Collaborations ---------- */
  useEffect(() => {
    fetchCompanies(REVERSE_STATUS_MAP[filter]);
  }, [filter]);

  const fetchCompanies = async (backendStatus = "pending") => {
    try {
      setLoading(true);
      setError(null);

      const query = new URLSearchParams({
        status: backendStatus,
      }).toString();

      const res = await fetch(
        `${apiUrl}/api/college/collab/request?${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to fetch collaborations");

      const data = await res.json();

      const normalized = (data.data || []).map((c) => ({
        ...c,
        status: STATUS_MAP[c.status] || "REQUEST",
      }));

      setCompanies(normalized);
    } catch (err) {
      setError(err.message);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Accept / Reject ---------- */
  const updateStatus = async (companyId, action) => {
    // ✅ Optimistic UI (instant removal)
    setCompanies((prev) =>
      prev.filter((c) => c.company.id !== companyId)
    );

    try {
      const res = await fetch(
        `${apiUrl}/api/college/collab/request/${companyId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ result: action }), // "1" or "0"
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Action failed");
    } catch (err) {
      alert(err.message);
      // rollback if API fails
      fetchCompanies(REVERSE_STATUS_MAP[filter]);
    }
  };

  const handleAccept = (id) => updateStatus(id, "1");
  const handleReject = (id) => updateStatus(id, "0");

  /* ---------- Search (client-side only) ---------- */
  const filteredCompanies = companies.filter((c) =>
    c.company.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="collaboration-page">
      {/* Header */}
      <div className="employees-header">
        <h2 className="page-title">Collaboration</h2>
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
        {["REQUEST", "COLLABORATED", "REJECTED"].map((item) => (
          <button
            key={item}
            className={`filter-pill ${filter === item ? "active" : ""}`}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && <div className="loading">Loading collaborations...</div>}
      {error && <div className="error">{error}</div>}

      {/* List */}
      <div className="collab-list">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="collab-card">
            <div className="collab-left">
              <div className="collab-logo">
                {getInitial(company.company.name)}
              </div>

              <div>
                <div className="collab-name">
                  {company.company.name}
                </div>
                <div className="collab-address">
                  {company.company.address}
                </div>
              </div>
            </div>

            <div className="collab-right">
              <StatusBadge
                status={company.status}
                onAccept={() => handleAccept(company.company.id)}
                onReject={() => handleReject(company.company.id)}
              />
            </div>
          </div>
        ))}

        {!loading && filteredCompanies.length === 0 && (
          <div className="empty-state">
            No {filter.toLocaleLowerCase()} records found.
          </div>
        )}
      </div>
    </div>
  );
}

export default CollegeCollaborationPage;
