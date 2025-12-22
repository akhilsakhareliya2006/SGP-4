import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

/* ---------- Status Badge Component ---------- */
function StatusBadge({ status, onSend, isSending }) {
  // Normalize status to uppercase for consistency
  const currentStatus = status ? status.toUpperCase() : "NOT_APPLIED";

  switch (currentStatus) {
    case "NOT APPLIED":
    case "NOT_APPLIED":
      return (
        <button 
          className="status-pill collaborate" 
          onClick={onSend}
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Collaborate"}
        </button>
      );

    case "PENDING":
      return <span className="status-pill pending">Pending</span>;

    case "COLLABORATED":
    case "ACCEPTED":
      return <span className="status-pill completed">Completed</span>;

    case "REJECTED":
      return <span className="status-pill rejected">Rejected</span>;

    default:
      return <span className="status-pill">{currentStatus}</span>;
  }
}

/* ---------- Main Page Component ---------- */
function CollaborationPage() {
  // Access company context if needed (e.g. for logging)
  const { company } = useOutletContext();
  const apiUrl = import.meta.env.VITE_API_URL


  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL"); // Current active tab
  const [colleges, setColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null); // To track which button is loading

  // --- 1. Fetch Colleges from Backend ---
  const fetchColleges = async () => {
    setIsLoading(true);
    try {
      // Map UI filter names to Backend query params
      // UI: "NOT_APPLIED" -> Backend: "not_applied"
      const queryFilter = filter.toLowerCase();

      const res = await fetch(`${apiUrl}/api/company/college?filter=${queryFilter}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.data) {
        // Backend specific filter logic fix: 
        // The backend 'else' block returns raw college objects without 'status'.
        // We manually inject the status if we are filtering by a specific type.
        const mappedData = data.data.map(college => ({
          ...college,
          status: filter === "ALL" ? college.status : filter // Inject status if missing
        }));
        
        setColleges(mappedData);
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch whenever the Filter tab changes
  useEffect(() => {
    fetchColleges();
  }, [filter]);


  // --- 2. Handle Collaborate Request ---
  const handleCollaborate = async (collegeId) => {
    setSendingId(collegeId);
    try {
      const res = await fetch(`${apiUrl}/api/company/collab/${collegeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // Optimistic Update: Update the UI immediately without re-fetching
        setColleges(prev => prev.map(c => 
          c.id === collegeId ? { ...c, status: "PENDING" } : c
        ));
      } else {
        alert(data.message || "Failed to send request");
      }
    } catch (error) {
      console.error("Request error:", error);
      alert("Something went wrong");
    } finally {
      setSendingId(null);
    }
  };


  // --- 3. Client-Side Search Filtering ---
  // The backend handles the status filter, but we handle the text search here
  const filteredColleges = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return colleges;

    return colleges.filter((college) => {
      return (
        (college.name && college.name.toLowerCase().includes(q)) ||
        (college.address && college.address.toLowerCase().includes(q))
      );
    });
  }, [search, colleges]);


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

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {[
          "ALL",
          "COLLABORATED",
          "NOT_APPLIED",
          "PENDING",
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

      {/* Content */}
      {isLoading ? (
        <div className="dashboard-loading">Loading Colleges...</div>
      ) : (
        <div className="college-list">
          {filteredColleges.map((college) => (
            <div key={college.id} className="college-card">
              <div className="college-left">
                <div className="college-logo">
                  {college.name ? college.name.charAt(0) : "C"}
                </div>

                <div>
                  <div className="college-name">{college.name}</div>
                  <div className="college-address">{college.address}</div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="college-right">
                <StatusBadge
                  status={college.status}
                  isSending={sendingId === college.id}
                  onSend={() => handleCollaborate(college.id)}
                />
              </div>
            </div>
          ))}

          {filteredColleges.length === 0 && (
            <div className="empty-state">No colleges found.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default CollaborationPage;