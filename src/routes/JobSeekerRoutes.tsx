import React from "react";
import { Routes, Route } from "react-router-dom";
import MyApplicationsPage from "../pages/jobseeker/MyApplicationsPage";
import ApplyToJobPage from "../pages/jobseeker/ApplyToJobPage";

export default function JobSeekerRoutes() {
  return (
    <Routes>
      <Route path="/applications" element={<MyApplicationsPage />} />
      <Route path="/apply/:id" element={<ApplyToJobPage />} />
    </Routes>
  );
}
