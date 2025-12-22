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
  const { company } = useOutletContext(); // Access company data from layout
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL


  // --- New State for Form Inputs ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    hireDate: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  const exportEmployees = async()=>{
    try {
      const res=await fetch(`${apiUrl}/api/company/export/employees`, {
          method: "GET",
          credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to export");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "employees.csv"; // or employees.csv
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error exporting employees:", error);
    }
  }

  // --- Fetch Employees ---
  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/company/employees`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        const formattedEmployees = data.data.map((employee) => ({
          id: employee.id,
          name: employee.user?.name || "Unknown",
          email: employee.user?.email || "No Email",
        }));
        setEmployees(formattedEmployees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- Handle Create Employee ---
  const handleCreateEmployee = async (e) => {
    e.preventDefault(); // Prevent page reload
    setIsCreating(true);

    try {
      const res = await fetch(`${apiUrl}/api/company/create/employee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          // hireDate: formData.hireDate // Add this if your backend expects it
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Success!
        alert("Employee created successfully!");
        setShowAddModal(false);
        setFormData({ name: "", email: "", hireDate: "" }); // Reset form
        fetchEmployees(); // Refresh list
      } else {
        // Handle server errors (e.g., "Email already exists")
        alert(data.message || "Failed to create employee");
      }
    } catch (error) {
      console.error("Creation error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // --- Filter Logic ---
  const filteredEmployees = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return employees;
    return employees.filter((emp) =>
      [emp.name, emp.email, emp.id].some((field) =>
        String(field).toLowerCase().includes(q)
      )
    );
  }, [search, employees]);

  if (isLoading) {
    return <div className="dashboard-loading">Loading Employees...</div>;
  }

  return (
    <div className="employees-page">
      {/* Header */}
      <div className="employees-header">
        <div>
          <h2 className="page-title">Employee List</h2>
          <p className="page-subtitle">
            Manage employees for <span style={{ fontWeight: "600" }}>{company?.name}</span>
          </p>
        </div>

        <div className="header-actions">
          <button className="export-btn" title="Export data" onClick={()=>exportEmployees()}>
            <img src={exportIcon} alt="Export" className="export-icon"/>
            <span className="export-text">Export</span>
          </button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Employee
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="employees-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <img src={gridIcon} alt="Grid" className="toggle-icon" />
          </button>
          <button
            className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <img src={listIcon} alt="List" className="toggle-icon" />
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="employees-grid">
          {filteredEmployees.map((emp) => (
            <div key={emp.id} className="employee-card">
              <div className="employee-avatar">{getInitials(emp.name)}</div>
              <div className="employee-info">
                <div className="employee-name">{emp.name}</div>
                <div className="employee-email">{emp.email}</div>
                <div className="employee-id">ID: {emp.id.slice(0, 8)}...</div>
              </div>
            </div>
          ))}
          {filteredEmployees.length === 0 && (
            <div className="empty-state">No employees found.</div>
          )}
        </div>
      ) : (
        <table className="employees-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <div className="table-employee">
                    <span className="table-avatar">{getInitials(emp.name)}</span>
                    <span>{emp.name}</span>
                  </div>
                </td>
                <td>{emp.email}</td>
                <td>{emp.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add New Employee</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form className="modal-form" onSubmit={handleCreateEmployee}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
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

              <div className="form-group">
                <label>Hire Date</label>
                <input
                  type="date"
                  required
                  value={formData.hireDate}
                  onChange={(e) =>
                    setFormData({ ...formData, hireDate: e.target.value })
                  }
                  max={new Date().toISOString().split("T")[0]}
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
                  {isCreating ? "Creating..." : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeesPage;