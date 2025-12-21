import { useMemo, useState } from "react";

/* ---------- Status Badge ---------- */
function StatusBadge({ status, onSend }) {
  switch (status) {
    case "NOT_APPLIED":
      return (
        <button className="btn-primary" onClick={onSend}>
          + Send Request
        </button>
      );

    case "PENDING":
      return <span className="status pending">⏳ Pending</span>;

    case "APPLIED":
      return <span className="status applied">📤 Applied</span>;

    case "COLLABORATED":
      return <span className="status success">✅ Collaborated</span>;

    case "REJECTED":
      return <span className="status rejected">❌ Rejected</span>;

    default:
      return null;
  }
}

/* ---------- Mock Data ---------- */
const MOCK_COLLEGES = [
  {
    id: 1,
    name: "CHARUSAT",
    address: "Anand, Gujarat",
    status: "NOT_APPLIED",
  },
  {
    id: 2,
    name: "LD College",
    address: "Ahmedabad, Gujarat",
    status: "PENDING",
  },
  {
    id: 3,
    name: "DAIICT",
    address: "Gandhinagar, Gujarat",
    status: "COLLABORATED",
  },
  {
    id: 4,
    name: "IIT",
    address: "Mumbai",
    status: "REJECTED",
  },
];

/* ---------- Page ---------- */
function CollaborationPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filteredColleges = useMemo(() => {
    return MOCK_COLLEGES.filter((college) => {
      const matchesSearch =
        college.name.toLowerCase().includes(search.toLowerCase()) ||
        college.address.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "ALL" || college.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="collaboration-page">
      {/* Header */}
      <div className="collab-header">
        <h2 className="page-title">Collaboration</h2>
        <p className="page-subtitle">
          Discover colleges and manage collaboration requests
        </p>
      </div>

      {/* Search */}
      <input
        className="search-input collab-search"
        placeholder="Search college by name or address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filters */}
      <div className="filter-tabs">
        {[
          "ALL",
          "NOT_APPLIED",
          "PENDING",
          "APPLIED",
          "COLLABORATED",
          "REJECTED",
        ].map((item) => (
          <button
            key={item}
            className={`filter-pill ${filter === item ? "active" : ""}`}
            onClick={() => setFilter(item)}
          >
            {item.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* College List */}
      <div className="college-list">
        {filteredColleges.map((college) => (
          <div key={college.id} className="college-card">
            <div className="college-left">
              <div className="college-logo">
                {college.name.charAt(0)}
              </div>

              <div>
                <div className="college-name">{college.name}</div>
                <div className="college-address">{college.address}</div>
              </div>
            </div>

            <div className="college-right">
              <StatusBadge
                status={college.status}
                onSend={() => alert("Request sent")}
              />
            </div>
          </div>
        ))}

        {filteredColleges.length === 0 && (
          <div className="empty-state">
            No colleges found
          </div>
        )}
      </div>
    </div>
  );
}

export default CollaborationPage;
