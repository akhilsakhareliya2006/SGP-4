import { useOutletContext } from "react-router-dom";

function StudentsPage() {
  const { college } = useOutletContext();

  return <h2>Students (coming soon)</h2>;
}

export default StudentsPage;
