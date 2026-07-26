import React from "react";
import { Routes, Route } from "react-router-dom";
import JobListingPage from "../pages/public/JobListingPage";
import JobDetailPage from "../pages/public/JobDetailPage";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<JobListingPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
    </Routes>
  );
}
