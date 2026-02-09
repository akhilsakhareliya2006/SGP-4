import { useOutletContext } from "react-router-dom";

function StudentDashboard() {
  const { student } = useOutletContext();

  return <h2>Dashboard (coming soon)</h2>;
}

export default StudentDashboard;
