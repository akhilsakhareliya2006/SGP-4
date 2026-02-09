import { useOutletContext } from "react-router-dom";

function ProfilePage() {
  const { student } = useOutletContext();

  return <h2>Profile (coming soon)</h2>;
}

export default ProfilePage;
