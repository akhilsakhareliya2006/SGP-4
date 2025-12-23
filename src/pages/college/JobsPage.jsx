import { useOutletContext } from "react-router-dom";

function JobsPage() {
  const { college } = useOutletContext();
  return <h2>Jobs (coming soon)</h2>;
}

export default JobsPage;
