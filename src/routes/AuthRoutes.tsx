import React from "react";
import LoginRegisterModal from "../components/auth/LoginRegisterModal";
import { Routes, Route } from "react-router-dom";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRegisterModal />} />
      <Route path="/register" element={<LoginRegisterModal />} />
    </Routes>
  );
}
