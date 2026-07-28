import React from "react";
import { Routes, Route } from "react-router-dom";
import JobPostingPage from "../pages/Recruiter/JobPostingPage";
import DashboardPage from "../pages/Recruiter/DashboardPage";
import JobApplicantsPage from "../pages/Recruiter/JobApplicantsPage";

export default function RecruiterRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="jobs/new" element={<JobPostingPage />} />
      <Route path="jobs/:id/applicants" element={<JobApplicantsPage />} />
    </Routes>
  );
}
