import { useMutation } from "@tanstack/react-query";
import api from "../axiosClient";
import { useAuth } from "../../context/AuthContext";

export interface ParsedFields {
  fullName?: string;
  phone?: string;
  currentTitle?: string;
  totalExperienceYears?: number;
  skills?: string[];
  preferredJobType?: string;
  preferredLocation?: string;
  certifications?: string[];
  portfolioLinks?: string[];
  expectedSalaryRange?: string;
}

export const useParseResumeMutation = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/api/onboarding/parse-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data; // { parsedFields: ParsedFields, creditsDeducted: number }
    },
  });
};

export const useOnboardingJobSeekerMutation = () => {
  const { accessToken, refreshToken, role, setTokens } = useAuth();
  return useMutation({
    mutationFn: async (data: ParsedFields) => {
      const res = await api.post("/api/onboarding/jobseeker", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.onboardingCompleted) {
        setTokens(accessToken!, refreshToken!, role!, true);
      }
    },
  });
};

export interface RecruiterFields {
  companyName: string;
  industry: string;
  size: string;
  designation: string;
}

export const useOnboardingRecruiterMutation = () => {
  const { accessToken, refreshToken, role, setTokens } = useAuth();
  return useMutation({
    mutationFn: async (data: RecruiterFields) => {
      const res = await api.post("/api/onboarding/recruiter", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.onboardingCompleted) {
        setTokens(accessToken!, refreshToken!, role!, true);
      }
    },
  });
};
