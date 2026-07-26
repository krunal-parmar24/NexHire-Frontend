import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface OnboardingGuardProps {
  children: ReactNode;
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { accessToken, onboardingCompleted, role } = useAuth();

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  if (onboardingCompleted) {
    return <Navigate to={role === "Recruiter" ? "/recruiter" : "/seeker/applications"} replace />;
  }

  return <>{children}</>;
}
