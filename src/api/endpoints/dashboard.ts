import api from "../axiosClient";

export interface DashboardResponse {
  activeJobPostings: number;
  totalApplicants: number;
  pendingReview: number;
  verificationStatus: string;
}

export const getRecruiterDashboard = (): Promise<DashboardResponse> =>
  api.get<DashboardResponse>("/api/dashboard/recruiter").then((r) => r.data);
