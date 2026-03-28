import { useEffect, useMemo, useState } from "react";
import {  useNavigate, useOutletContext } from "react-router-dom";
import gridIcon from "../../assets/icons/grid.png";
import listIcon from "../../assets/icons/list.png";
import exportIcon from "../../assets/icons/export.png";
import addIcon from "../../assets/icons/add.png";

/* ---------- Helpers ---------- */
function getInitials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function getColorIndex(id) {
  if (!id) return 0;
  return (
    Math.abs(
      id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
    ) % 5
  );
}

function MentorsPage() {
  const { college } = useOutletContext();
  const navigate = useNavigate(); // 👈 MOVED TO TOP: Safe from conditional render bugs
  const apiUrl = import.meta.env.VITE_API_URL;

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [showAddModal, setShowAddModal] = useState(false);

  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [isCreating, setIsCreating] = useState(false);

  /* ---------- FETCH MENTORS ---------- */
  // We make the signal optional so we can still call fetchMentors() manually after creating a new mentor
  const fetchMentors = async (signal = null) => {
    try {
      const res = await fetch(`${apiUrl}/api/college/mentors`, {
        credentials: "include",
        signal, // 👈 Attach the optional abort signal
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch mentors");
      }

      const mentorsList = data?.data?.mentors || [];
      setMentors(Array.isArray(mentorsList) ? mentorsList : []);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log("Mentors fetch aborted due to navigation");
        return; // 👈 Silently exit if we cancelled it
      }
      console.error("Fetch mentors error:", err);
      setMentors([]);
    } finally {
      // Only disable loading if the request wasn't cancelled
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    
    // Pass the signal when fetching on mount
    fetchMentors(controller.signal);

    // Cleanup: Cancel the fetch if the user leaves the page immediately
    return () => controller.abort();
  }, [apiUrl]);

  /* ---------- CREATE MENTOR ---------- */
  const handleCreateMentor = async (e) => {
    e.preventDefault();
    if (isCreating) return;

    setIsCreating(true);

    try {
      const res = await fetch(`${apiUrl}/api/college/create/mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add mentor");
      }

      setShowAddModal(false);
      setFormData({ name: "", email: "" });

      // Call fetchMentors manually without a signal so it completes normally
      await fetchMentors();
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  // ... (Keep your exportMentors, useMemo, and return statement exactly the same)
  // Just make sure to DELETE the duplicate `const navigate = useNavigate();` that was near line 125!
  /* ---------- EXPORT CSV ---------- */
  const exportMentors = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/college/export/mentors`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Export failed");
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "mentors.csv";

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Mentor export error:", err);
      alert("Failed to export mentors");
    }
  };

  /* ---------- SEARCH ---------- */
  const filteredMentors = useMemo(() => {
    return mentors.filter((m) =>
      [m?.name, m?.email, m?.id]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [mentors, search]);

  
  return (
    
    <div className="mentors-page">
      {/* ================= HEADER ================= */}
      <div className="card mentors-header-card">
        <div className="header-row">
          <div>
            <h2 className="page-title">
              Mentors ({mentors.length})
            </h2>

            <p className="page-subtitle">
              Manage mentors for <strong>{college?.name}</strong>
            </p>
          </div>

          <div className="header-actions">
            <button className="btn-outline" onClick={exportMentors}>
              <img src={exportIcon} alt="Export" />
              Export
            </button>

            <button
              className="btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <img src={addIcon} alt="Add" className="btn-add-icon" />
              Add Mentor
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
              className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <img src={gridIcon} alt="Grid" />
            </button>

            <button
              className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <img src={listIcon} alt="List" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= LIST VIEW ================= */}
      {viewMode === "list" ? (
        <div className="card mentors-list-card" style={{ height: "100%", overflowY: "auto", paddingBottom: "60px" }}>
          <div className="mentors-header-grid">
            <div>ID</div>
            <div>Name</div>
            <div>Email</div>
            <div></div>
          </div>

          <div className="mentors-rows">
            {/* 👈 Inline Loading Check for List View */}
            {isLoading ? (
              <div className="dashboard-loading" style={{ padding: '4rem 0', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
                Loading mentors...
              </div>
            ) : filteredMentors.length === 0 ? (
              <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>No mentors found</div>
            ) : (
              filteredMentors.map((m) => {
                const colorIndex = getColorIndex(m.id);
                return (
                  <div className="mentor-row" key={m.id} onClick={() => navigate(`/college/mentors/${m.id}`)} style={{ cursor: 'pointer' }}>
                    <div className="col id-col">{m.id.slice(0, 4)}</div>
                    <div className="col name-col">
                      <div className="mentor-cell">
                        <span className={`avatar color-${colorIndex}`}>
                          {getInitials(m.name)}
                        </span>
                        <span className="name-text">{m.name}</span>
                      </div>
                    </div>
                    <div className="col email-col">{m.email}</div>
                    <div className="col actions-col"></div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="mentor-grid" style={{ height: "100%", overflowY: "auto", paddingBottom: "60px" }}>
           {/* 👈 Inline Loading Check for Grid View */}
           {isLoading ? (
              <div className="dashboard-loading" style={{ gridColumn: '1 / -1', padding: '4rem 0', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
                Loading mentors...
              </div>
            ) : filteredMentors.length === 0 ? (
               <div className="empty-state" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center' }}>No mentors found</div>
            ) : (
              filteredMentors.map((m) => {
                const colorIndex = getColorIndex(m.id);
                return (
                  <div key={m.id} className="mentor-card" onClick={() => navigate(`/college/mentors/${m.id}`)} style={{ cursor: 'pointer' }}>
                    <span className={`avatar large color-${colorIndex}`}>
                      {getInitials(m.name)}
                    </span>
                    <small className="mentor-id">ID: {m.id.slice(0, 8)}</small>
                    <h4 className="mentor-name">{m.name}</h4>
                    <p className="mentor-email">{m.email}</p>
                  </div>
                );
              })
            )}
        </div>
      )}

      {/* ================= ADD MENTOR MODAL ================= */}
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
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form className="modal-form" onSubmit={handleCreateMentor}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter mentor name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  placeholder="Enter mentor email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setShowAddModal(false)} disabled={isCreating}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isCreating}>
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