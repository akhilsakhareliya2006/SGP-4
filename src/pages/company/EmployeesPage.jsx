import { useMemo, useState } from "react";
import gridIcon from "../../assets/icons/grid.png";
import listIcon from "../../assets/icons/list.png";
import exportIcon from "../../assets/icons/export.png";


const MOCK_EMPLOYEES = [
  { id: "EMP001", name: "Jennifer Martinez", email: "jennifer@workzen.com" },
  { id: "EMP002", name: "Robert Taylor", email: "robert@workzen.com" },
  { id: "EMP003", name: "Lisa Anderson", email: "lisa@workzen.com" },
  { id: "EMP004", name: "David Wilson", email: "david@workzen.com" },
];

function getInitials(name) {
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

  const filteredEmployees = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return MOCK_EMPLOYEES;
    return MOCK_EMPLOYEES.filter((emp) =>
      [emp.name, emp.email, emp.id].some((field) =>
        field.toLowerCase().includes(q)
      )
    );
  }, [search]);

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


          <button className="btn-primary">+ Add Employee</button>
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


    </div>
  );
}

export default EmployeesPage;
