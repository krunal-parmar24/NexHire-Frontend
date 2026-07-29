import api from "../axiosClient";

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

export interface ParseResumeResponse {
  parsedFields: ParsedFields;
  creditsDeducted: number;
}

export interface RecruiterFields {
  companyName: string;
  industry: string;
  size: string;
  designation: string;
}

export interface OnboardingResponse {
  onboardingCompleted: boolean;
}

export const parseResume = (file: File): Promise<ParseResumeResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  return api
    .post<ParseResumeResponse>("/api/onboarding/parse-resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

export const onboardJobSeeker = (
  data: ParsedFields
): Promise<OnboardingResponse> =>
  api
    .post<OnboardingResponse>("/api/onboarding/jobseeker", data)
    .then((r) => r.data);

export const onboardRecruiter = (
  data: RecruiterFields
): Promise<OnboardingResponse> =>
  api
    .post<OnboardingResponse>("/api/onboarding/recruiter", data)
    .then((r) => r.data);
