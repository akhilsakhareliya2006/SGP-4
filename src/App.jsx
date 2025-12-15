import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import CollegeRegister from "./pages/CollegeRegister";
import CompanyRegister from "./pages/CompanyRegister";
import RegisterChoice from "./pages/RegisterChoice";


function App() {
  return (
    <>
      {/* ✅ Navbar ALWAYS at top */}
      <Navbar />

      {/* ✅ Pages below navbar */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/college" element={<CollegeRegister />} />
        <Route path="/register/company" element={<CompanyRegister />} />
        <Route path="/register" element={<RegisterChoice />} />

      </Routes>
    </>
  );
}

export default App;
