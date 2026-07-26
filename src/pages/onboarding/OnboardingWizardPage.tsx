import React from "react";
import { useAuth } from "../../context/AuthContext";
import JobSeekerWizard from "../../components/onboarding/JobSeekerWizard";
import RecruiterWizard from "../../components/onboarding/RecruiterWizard";

export default function OnboardingWizardPage() {
  const { role } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8">
      {role === "JobSeeker" ? <JobSeekerWizard /> : <RecruiterWizard />}
    </div>
  );
}
