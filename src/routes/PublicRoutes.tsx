import React from "react";
import { Routes, Route } from "react-router-dom";
import JobListingPage from "../pages/public/JobListingPage";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<JobListingPage />} />
    </Routes>
  );
}
