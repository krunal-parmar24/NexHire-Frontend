import React from "react";
import { Routes, Route } from "react-router-dom";
import JobPostingPage from "../pages/Recruiter/JobPostingPage";
import UnverifiedBadge from "../components/recruiter/UnverifiedBadge";

export default function RecruiterRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="p-8">
            <UnverifiedBadge />
            <div className="mt-8 text-white">Recruiter Dashboard (stub)</div>
          </div>
        }
      />
      <Route path="jobs/new" element={<JobPostingPage />} />
    </Routes>
  );
}
