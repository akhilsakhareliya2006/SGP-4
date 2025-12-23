import { useOutletContext } from "react-router-dom";

function AdminSettingsPage() {
  const { company } = useOutletContext();
  return <h2>Admin Settings (coming soon)</h2>;
}

export default AdminSettingsPage;

