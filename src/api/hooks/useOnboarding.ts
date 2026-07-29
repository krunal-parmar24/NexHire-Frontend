import { useMutation } from "@tanstack/react-query";
import {
  parseResume,
  onboardJobSeeker,
  onboardRecruiter,
} from "../endpoints/onboarding";
import { useAuth } from "../../context/AuthContext";

// Re-export types for backward compatibility with components that import them from here
export type { ParsedFields, RecruiterFields } from "../endpoints/onboarding";

export const useParseResumeMutation = () => {
  return useMutation({
    mutationFn: parseResume,
  });
};

export const useOnboardingJobSeekerMutation = () => {
  const { accessToken, refreshToken, role, setTokens } = useAuth();
  return useMutation({
    mutationFn: onboardJobSeeker,
    onSuccess: (data) => {
      if (data.onboardingCompleted && accessToken && refreshToken && role) {
        setTokens(accessToken, refreshToken, role, true);
      }
    },
  });
};

export const useOnboardingRecruiterMutation = () => {
  const { accessToken, refreshToken, role, setTokens } = useAuth();
  return useMutation({
    mutationFn: onboardRecruiter,
    onSuccess: (data) => {
      if (data.onboardingCompleted && accessToken && refreshToken && role) {
        setTokens(accessToken, refreshToken, role, true);
      }
    },
  });
};
