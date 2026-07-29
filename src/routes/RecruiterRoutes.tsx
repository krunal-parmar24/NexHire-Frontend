import React from "react";
import { Routes, Route } from "react-router-dom";
import JobPostingPage from "../pages/recruiter/JobPostingPage";
import DashboardPage from "../pages/recruiter/DashboardPage";
import JobApplicantsPage from "../pages/recruiter/JobApplicantsPage";

export default function RecruiterRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="jobs/new" element={<JobPostingPage />} />
      <Route path="jobs/:id/applicants" element={<JobApplicantsPage />} />
    </Routes>
  );
}
