import { useOutletContext } from "react-router-dom";

function DashboardPage() {
  const { company } = useOutletContext();

  return <h2>Dashboard (coming soon)</h2>;
}

export default DashboardPage;




