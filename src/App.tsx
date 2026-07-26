import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import JobSeekerRoutes from "./routes/JobSeekerRoutes";
import RecruiterRoutes from "./routes/RecruiterRoutes";
import RouteGuard from "./routes/RouteGuard";
import OnboardingGuard from "./routes/OnboardingGuard";
import OnboardingWizardPage from "./pages/onboarding/OnboardingWizardPage";

export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route
        path="/onboarding"
        element={
          <OnboardingGuard>
            <OnboardingWizardPage />
          </OnboardingGuard>
        }
      />
      <Route
        path="/seeker/*"
        element={
          <RouteGuard>
            <JobSeekerRoutes />
          </RouteGuard>
        }
      />
      <Route
        path="/recruiter/*"
        element={
          <RouteGuard>
            <RecruiterRoutes />
          </RouteGuard>
        }
      />
    </Routes>
  );
}
