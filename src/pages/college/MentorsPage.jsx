import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

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

const SAMPLE_MENTORS = [
  { id: "1", name: "Asha Patel ", email: "akhilsakhareliya1234@example.com" },
  { id: "2", name: "Rohit Kumar", email: "rohit.kumar@example.com" },
  { id: "3", name: "Simran Kaur", email: "simran.kaur@example.com" },
  { id: "4", name: "Vikram Singh", email: "vikram.singh@example.com" },
  { id: "5", name: "Neha Sharma", email: "neha.sharma@example.com" },
  { id: "6", name: "Neha Sharma", email: "neha.sharma@example.com" },
  { id: "7", name: "Neha Sharma", email: "neha.sharma@example.com" },
  { id: "8", name: "Neha Sharma", email: "neha.sharma@example.com" },


];

function MentorsPage() {
  const { college } = useOutletContext();
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

  /* ---------- CREATE MENTOR ---------- */
  const handleCreateMentor = async (e) => {
    e.preventDefault();
    if (isCreating) return;

    setIsCreating(true);

    try {
      const res = await fetch(
        `${apiUrl}/api/college/create/mentor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add mentor");
      }

      setShowAddModal(false);
      setFormData({ name: "", email: "" });

      // refresh list
      fetchMentors();
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  const exportMentors = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/college/export/mentors`,
        {
          method: "GET",
          credentials: "include",
        }
      );

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


  /* ---------- Fetch Mentors ---------- */
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/college/mentors`, {
          credentials: "include",
        });

        const data = await res.json();
        console.log("API response:", data);

        if (
          data?.data?.mentors &&
          Array.isArray(data.data.mentors) &&
          data.data.mentors.length > 0
        ) {
          setMentors(data.data.mentors);
        } else {
          setMentors(SAMPLE_MENTORS);
        }
      } catch (err) {
        console.error(err);
        setMentors(SAMPLE_MENTORS);
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
            <h2 className="page-title"> Mentors</h2>
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

      {/* ================= LIST CARD (header + rows in same card) ================= */}
      {viewMode === "list" ? (
        <div className="card mentors-list-card">
          <div className="mentors-header-grid">
            <div>ID</div>
            <div>Name</div>
            <div>Email</div>
            <div></div>
          </div>

          <div className="mentors-rows">
            {filteredMentors.map((m, i) => (
              <div className="mentor-row" key={m.id}>
                <div className="col id-col">{m.id.slice(0, 4)}</div>
                <div className="col name-col">
                  <div className="mentor-cell">
                    <span className={`avatar color-${i % 5}`}>
                      {getInitials(m.name)}
                    </span>
                    <span className="name-text">{m.name}</span>
                  </div>
                </div>
                <div className="col email-col">{m.email}</div>
                <div className="col actions-col"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mentor-grid">
          {filteredMentors.map((m, i) => (
            <div key={m.id} className="mentor-card">
              <span className={`avatar large color-${i % 5}`}>
                {getInitials(m.name)}
              </span>

              <small className="mentor-id">ID: {m.id.slice(0, 8)}</small>
              <h4 className="mentor-name">{m.name}</h4>
              <p className="mentor-email">{m.email}</p>
            </div>
          ))}
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
                  type="text"
                  required
                  placeholder="Enter mentor name"
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
                  placeholder="Enter mentor email"
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
                  disabled={isCreating}
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
