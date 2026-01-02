import { useEffect, useMemo, useState } from "react";
import gridIcon from "../../assets/icons/grid.png";
import listIcon from "../../assets/icons/list.png";
import exportIcon from "../../assets/icons/export.png";
import { useOutletContext } from "react-router-dom";

function getInitials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

function EmployeesPage() {
  const { company } = useOutletContext();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    hireDate: "",
  });

  // 🔥 Employee Details States
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState(null);

  /* ---------------- EXPORT ---------------- */
  const exportEmployees = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/company/export/employees`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "employees.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- FETCH EMPLOYEES ---------------- */
  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/company/employees`, {
        credentials: "include",
      });
      const data = await res.json();
      if (Array.isArray(data.data)) {
        setEmployees(
          data.data.map((e) => ({
            id: e.id,
            name: e.user?.name || "Unknown",
            email: e.user?.email || "N/A",
          }))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ---------------- CREATE EMPLOYEE ---------------- */
  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const res = await fetch(`${apiUrl}/api/company/create/employee`, {
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
        setShowAddModal(false);
        setFormData({ name: "", email: "", hireDate: "" });
        fetchEmployees();
      } else {
        alert(data.message || "Failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  /* ---------------- FETCH SINGLE EMPLOYEE ---------------- */
  const fetchEmployeeDetails = async (id) => {
    setShowDetailsModal(true);
    setDetailsLoading(true);

    try {
      const res = await fetch(
        `${apiUrl}/api/company/employee/${id}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) setEmployeeDetails(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredEmployees = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return employees;
    return employees.filter((e) =>
      [e.name, e.email, e.id].some((f) =>
        String(f).toLowerCase().includes(q)
      )
    );
  }, [search, employees]);

  if (isLoading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="employees-page">
      {/* HEADER */}
      <div className="employees-header">
        <div>
          <h2>Employee List</h2>
          <p>
            Manage employees for <b>{company?.name}</b>
          </p>
        </div>
        <div className="header-actions">
          <button onClick={exportEmployees}>
            <img src={exportIcon} alt="" /> Export
          </button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Employee
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="employees-toolbar">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div>
          <button onClick={() => setViewMode("grid")}>
            <img src={gridIcon} />
          </button>
          <button onClick={() => setViewMode("list")}>
            <img src={listIcon} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {viewMode === "grid" ? (
        <div className="employees-grid">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="employee-card clickable"
              onClick={() => fetchEmployeeDetails(emp.id)}
            >
              <div className="employee-avatar">
                {getInitials(emp.name)}
              </div>
              <div>
                <b>{emp.name}</b>
                <div>{emp.email}</div>
                <small>ID: {emp.id.slice(0, 8)}...</small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="employees-table">
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr
                key={emp.id}
                className="clickable-row"
                onClick={() => fetchEmployeeDetails(emp.id)}
              >
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Add Employee</h3>
            <form onSubmit={handleCreateEmployee}>
              <input
                placeholder="Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <button disabled={isCreating}>
                {isCreating ? "Creating..." : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {showDetailsModal && (
        <div className="modal-overlay">
          <div className="modal-card large">
            <button
              className="modal-close"
              onClick={() => {
                setShowDetailsModal(false);
                setEmployeeDetails(null);
              }}
            >
              ✕
            </button>

            {detailsLoading ? (
              <p>Loading details...</p>
            ) : (
              employeeDetails && (
                <>
                  <h3>{employeeDetails.user.name}</h3>
                  <p>{employeeDetails.user.email}</p>

                  <h4>Interviews</h4>
                  {employeeDetails.interviews.length === 0 && (
                    <p>No interviews</p>
                  )}

                  {employeeDetails.interviews.map((i) => (
                    <div key={i.id} className="interview-card">
                      <b>{i.date} – {i.time}</b>
                      <p>{i.address}</p>
                      <p>
                        Status: {i.selected ? "✅ Selected" : "⏳ Pending"}
                      </p>
                      <hr />
                      <p>
                        Student: {i.student.rollNo} ({i.student.branch})
                      </p>
                      <p>
                        College: {i.student.college.name}
                      </p>
                    </div>
                  ))}
                </>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeesPage;
