import { useOutletContext } from "react-router-dom";

function CollegeAdminSettings() {
  const { college } = useOutletContext();

  return <h2>Admin Settings (coming soon)</h2>;
}

export default CollegeAdminSettings;
