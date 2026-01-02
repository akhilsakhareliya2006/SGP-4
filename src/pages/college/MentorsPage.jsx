import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import gridIcon from "../../assets/icons/grid.png";
import listIcon from "../../assets/icons/list.png";
import exportIcon from "../../assets/icons/export.png";

/* ---------- Helpers ---------- */
function getInitials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function MentorsPage() {
  const { college } = useOutletContext();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [showAddModal, setShowAddModal] = useState(false);

  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  

  /* ---------- Fetch Mentors ---------- */
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/college/mentors`, {
          credentials: "include",
        });
        const data = await res.json();
        setMentors(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, [apiUrl]);

  /* ---------- Search ---------- */
  const filteredMentors = useMemo(() => {
    return mentors.filter((m) =>
      [m.name, m.email, m.id]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [mentors, search]);

  if (isLoading) {
    return <div className="dashboard-loading">Loading mentors...</div>;
  }

  return (
    <div className="mentors-page">
      {/* ================= TOP CARD ================= */}
      <div className="card mentors-header-card">
        <div className="header-row">
          <div>
            <h2 className="page-title">Mentors</h2>
            <p className="page-subtitle">
              Manage mentors for <strong>{college?.name}</strong>
            </p>
          </div>

          <div className="header-actions">
            <button className="btn-outline">
              <img src={exportIcon} alt="" />
              Export
            </button>

            <button
              className="btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              + Add Mentor
            </button>
          </div>
        </div>

        <div className="toolbar-row">
          <input
            className="search-input"
            placeholder="Search mentors by name, email or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="view-toggle">
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
            >
              <img src={gridIcon} alt="Grid" />
            </button>

            <button
              className={viewMode === "list" ? "active" : ""}
              onClick={() => setViewMode("list")}
            >
              <img src={listIcon} alt="List" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= LIST CARD ================= */}
      <div className="card mentors-list-card">
        {viewMode === "list" ? (
          <table className="mentors-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredMentors.map((m, i) => (
                <tr key={m.id}>
                  <td>{m.id.slice(0, 4)}...</td>
                  <td>
                    <div className="mentor-cell">
                      <span className={`avatar color-${i % 5}`}>
                        {getInitials(m.name)}
                      </span>
                      {m.name}
                    </div>
                  </td>
                  <td>{m.email}</td>
                  <td className="menu-dots">⋮</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="mentor-grid">
            {filteredMentors.map((m, i) => (
              <div key={m.id} className="mentor-card">
                <span className={`avatar large color-${i % 5}`}>
                  {getInitials(m.name)}
                </span>
                <h4>{m.name}</h4>
                <p>{m.email}</p>
                <small>ID: {m.id.slice(0, 8)}...</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorsPage;
