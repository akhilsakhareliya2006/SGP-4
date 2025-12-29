import { useEffect, useMemo, useState } from "react";
import gridIcon from "../../assets/icons/grid.png";
import listIcon from "../../assets/icons/list.png";
import exportIcon from "../../assets/icons/export.png";
import { useOutletContext } from "react-router-dom";

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
  // const [isLoading, setIsLoading] = useState(true);  //with backend
  const [isLoading, setIsLoading] = useState(false);   // for frontend only
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    joinDate: "",
  });

  /* ---------- Fetch Mentors ---------- */
  const fetchMentors = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/college/mentors`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        const formatted = data.data.map((mentor) => ({
          id: mentor.id,
          name: mentor.user?.name || "Unknown",
          email: mentor.user?.email || "No Email",
        }));
        setMentors(formatted);
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // comment if using only frontend
  // useEffect(() => {
  //   fetchMentors();
  // }, []);

  /* ---------- Create Mentor ---------- */
  const handleCreateMentor = async (e) => {
    e.preventDefault();
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

      const data = await res.json();

      if (res.ok) {
        alert("Mentor added successfully");
        setShowAddModal(false);
        setFormData({ name: "", email: "", joinDate: "" });
        fetchMentors();
      } else {
        alert(data.message || "Failed to add mentor");
      }
    } catch (error) {
      console.error("Create mentor error:", error);
      alert("Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  /* ---------- Filter ---------- */
  const filteredMentors = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return mentors;
    return mentors.filter((m) =>
      [m.name, m.email, m.id].some((field) =>
        String(field).toLowerCase().includes(q)
      )
    );
  }, [search, mentors]);

  if (isLoading) {
    return <div className="dashboard-loading">Loading Mentors...</div>;
  }

  return (
    <div className="employees-page">
      {/* Header */}
      <div className="employees-header">
        <div>
          <h2 className="page-title">Mentors</h2>
          <p className="page-subtitle">
            Manage mentors for{" "}
            <span style={{ fontWeight: 600 }}>{college?.name}</span>
          </p>
        </div>

        <div className="header-actions">
          <button className="export-btn">
            <img src={exportIcon} alt="Export" className="export-icon" />
            <span className="export-text">Export</span>
          </button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Mentor
          </button>
        </div>
      </div>

      {/* Toolbar */}
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
            <img src={gridIcon} className="toggle-icon" />
          </button>
          <button
            className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <img src={listIcon} className="toggle-icon" />
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="employees-grid">
          {filteredMentors.map((m) => (
            <div key={m.id} className="employee-card">
              <div className="employee-avatar">{getInitials(m.name)}</div>
              <div className="employee-info">
                <div className="employee-name">{m.name}</div>
                <div className="employee-email">{m.email}</div>
                <div className="employee-id">ID: {m.id.slice(0, 8)}...</div>
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

      {/* Add Mentor Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add New Mentor</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
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
                <button type="submit" className="btn-primary">
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
