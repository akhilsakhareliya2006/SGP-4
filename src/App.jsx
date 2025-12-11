import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import CollegeRegister from "./pages/CollegeRegister.jsx";
import CompanyRegister from "./pages/CompanyRegister.jsx";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/college" element={<CollegeRegister />} />
          <Route path="/register/company" element={<CompanyRegister />} />
          {/* later: add /dashboard, etc */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
