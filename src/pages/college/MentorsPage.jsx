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
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

function MentorsPage() {
  const { college } = useOutletContext();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showAddModal, setShowAddModal] = useState(false);

  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  /* ---------- Fetch Mentors ---------- */
  const fetchMentors = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${apiUrl}/api/college/mentors`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && Array.isArray(data.data)) {
        setMentors(
          data.data.map((mentor) => ({
            id: mentor.id,
            name: mentor?.name || "Unknown",
            email: mentor?.email || "No Email",
          }))
        );
      }
    } catch (err) {
      console.error("Fetch mentors error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  /* ---------- Create Mentor (FREEZE-SAFE) ---------- */
  const handleCreateMentor = async (e) => {
    e.preventDefault();
    if (isCreating) return;

    setIsCreating(true);

    try {
      const res = await fetch(`${apiUrl}/api/college/create/mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to add mentor");
      }

      alert("Mentor added successfully");

      setFormData({ name: "", email: "" });
      setShowAddModal(false);

      await fetchMentors();
    } catch (err) {
      console.error("Create mentor error:", err);
      alert(err.message || "Something went wrong");
    } finally {
      setIsCreating(false); // ✅ ALWAYS resets
    }
  };

  /* ---------- Reset loading if modal closed ---------- */
  useEffect(() => {
    if (!showAddModal) {
      setIsCreating(false);
    }
  }, [showAddModal]);

  const exportMentors = async()=>{
    try {
      const res=await fetch(`${apiUrl}/api/college/export/mentors`, {
          method: "GET",
          credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to export");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mentors.csv"; // or employees.csv
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error exporting mentors:", error);
    }
  }

  /* ---------- Search Filter ---------- */
  const filteredMentors = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return mentors;
    return mentors.filter((m) =>
      [m.name, m.email, m.id].some((f) =>
        String(f).toLowerCase().includes(q)
      )
    );
  }, [search, mentors]);

  if (isLoading) {
    return <div className="dashboard-loading">Loading Mentors...</div>;
  }

  return (
    <div className="employees-page">
      {/* ---------- Header ---------- */}
      <div className="employees-header">
        <div>
          <h2 className="page-title">Mentors</h2>
          <p className="page-subtitle">
            Manage mentors for{" "}
            <span style={{ fontWeight: 600 }}>{college?.name}</span>
          </p>
        </div>

        <div className="header-actions">
          <button className="export-btn" onClick={()=>exportMentors()}>
            <img src={exportIcon} className="export-icon" alt="Export" />
            <span className="export-text">Export</span>
          </button>

          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Mentor
          </button>
        </div>
      </div>

      {/* ---------- Toolbar ---------- */}
      <div className="employees-toolbar">
        <input
          className="search-input"
          placeholder="Search mentors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <img src={gridIcon} className="toggle-icon" alt="Grid" />
          </button>

          <button
            className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <img src={listIcon} className="toggle-icon" alt="List" />
          </button>
        </div>
      </div>

      {/* ---------- Content ---------- */}
      {viewMode === "grid" ? (
        <div className="employees-grid">
          {filteredMentors.map((m) => (
            <div key={m.id} className="employee-card">
              <div className="employee-avatar">{getInitials(m.name)}</div>
              <div className="employee-info">
                <div className="employee-name">{m.name}</div>
                <div className="employee-email">{m.email}</div>
                <div className="employee-id">
                  ID: {m.id.slice(0, 8)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="employees-table">
          <thead>
            <tr>
              <th>Mentor</th>
              <th>Email</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredMentors.map((m) => (
              <tr key={m.id}>
                <td>
                  <div className="table-employee">
                    <span className="table-avatar">
                      {getInitials(m.name)}
                    </span>
                    <span>{m.name}</span>
                  </div>
                </td>
                <td>{m.email}</td>
                <td>{m.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ---------- Add Mentor Modal ---------- */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h3>Add New Mentor</h3>
                <p className="modal-subtitle">
                  College: <strong>{college?.name}</strong>
                </p>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form className="modal-form" onSubmit={handleCreateMentor}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isCreating}
                >
                  {isCreating ? "Adding..." : "Add Mentor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorsPage;
