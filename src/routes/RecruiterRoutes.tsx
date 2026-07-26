import React from "react";
import { Routes, Route } from "react-router-dom";
import UnverifiedBadge from "../components/recruiter/UnverifiedBadge";

export default function RecruiterRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <div className="p-8">
          <UnverifiedBadge />
          <div className="mt-8 text-white">Recruiter Dashboard (stub)</div>
        </div>
      } />
    </Routes>
  );
}
