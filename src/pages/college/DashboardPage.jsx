import { useOutletContext } from "react-router-dom";

function CollegeDashboard() {
  const { college } = useOutletContext();

  return <h2>Dashboard (coming soon)</h2>;
}

export default CollegeDashboard;
