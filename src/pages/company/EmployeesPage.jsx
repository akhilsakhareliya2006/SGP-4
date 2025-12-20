import { useEffect, useMemo, useState } from "react";
import gridIcon from "../../assets/icons/grid.png";
import listIcon from "../../assets/icons/list.png";
import exportIcon from "../../assets/icons/export.png";

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
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [showAddModal, setShowAddModal] = useState(false);
  // 1. Initialize as empty array [] instead of null to avoid render errors
  const [employees, setEmployees] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/company/employees", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();

        // Ensure we are mapping over an array (safety check)
        if (data && Array.isArray(data.data)) {
          const formattedEmployees = data.data.map((employee) => ({
            id: employee.id,
            // Safety check for nested user object
            name: employee.user?.name || "Unknown",
            email: employee.user?.email || "No Email",
          }));
          console.log(formattedEmployees);
          setEmployees(formattedEmployees);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return employees;
    
    // 2. Filter the real 'employees' state, not MOCK_EMPLOYEES
    return employees.filter((emp) =>
      [emp.name, emp.email, emp.id].some((field) =>
        String(field).toLowerCase().includes(q)
      )
    );
  }, [search, employees]);

  return (
    <div className="employees-page">
      {/* ===== Header ===== */}
      <div className="employees-header">
        <div>
          <h2 className="page-title">Employee List</h2>
          <p className="page-subtitle">
            View and manage all employees in your organization.
          </p>
        </div>

        <div className="header-actions">
          <button className="export-btn" title="Export data">
            <img src={exportIcon} alt="Export" className="export-icon" />
            <span className="export-text">Export</span>
          </button>

          <button
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add Employee
          </button>
        </div>
      </div>

      {/* ===== Search + View Toggle ===== */}
      <div className="employees-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search employees by name, email, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <img src={gridIcon} alt="Grid view" className="toggle-icon" />
          </button>

          <button
            className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <img src={listIcon} alt="List view" className="toggle-icon" />
          </button>
        </div>
      </div>

      {/* ===== Employees Content ===== */}
      {isLoading ? (
        <div className="loading-state">Loading employees...</div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="employees-grid">
              {filteredEmployees.map((emp) => (
                <div key={emp.id} className="employee-card">
                  <div className="employee-avatar">
                    {getInitials(emp.name)}
                  </div>
                  <div className="employee-info">
                    <div className="employee-name">{emp.name}</div>
                    <div className="employee-email">{emp.email}</div>
                    <div className="employee-id">ID: {emp.id}</div>
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
                        <span className="table-avatar">
                          {getInitials(emp.name)}
                        </span>
                        <span>{emp.name}</span>
                      </div>
                    </td>
                    <td>{emp.email}</td>
                    <td>{emp.id}</td>
                  </tr>
                ))}

                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={3} className="empty-state">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* ===== Add Employee Modal ===== */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h3>Add New Employee</h3>
                <p className="modal-subtitle">
                  Fill in the details to create a new employee record.
                </p>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form className="modal-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" required />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" required />
              </div>

              <div className="form-group">
                <label>Hire Date</label>
                <input type="date" required />
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
                  Create Employee
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