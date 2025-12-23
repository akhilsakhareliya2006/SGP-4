import { useOutletContext } from "react-router-dom";

function CollegeCollaboration() {
  const { college } = useOutletContext();

  return <h2>Collaboration (coming soon)</h2>;
}

export default CollegeCollaboration;
