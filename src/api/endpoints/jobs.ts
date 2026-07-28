import axiosClient from "../axiosClient";
import { ScreeningQuestion } from "../../types/screeningQuestion";

export interface CreateJobRequest {
  title: string;
  description: string;
  requirements: string;
  location: string;
  jobType: string;
  salaryRange?: string;
  remoteType: string;
  screeningQuestions: ScreeningQuestion[];
}

export interface JobResponse {
  id: string;
  status: string;
}

export const createJob = (data: CreateJobRequest): Promise<JobResponse> =>
  axiosClient.post<JobResponse>("/api/jobs", data).then((r) => r.data);

export const updateJob = (
  id: string,
  data: CreateJobRequest
): Promise<JobResponse> =>
  axiosClient.put<JobResponse>(`/api/jobs/${id}`, data).then((r) => r.data);

export interface ApplicantDto {
  applicationId: string;
  applicantName: string;
  status: string;
  answers: { questionId: string; value: string }[];
  resumeUrl?: string;
  profileSummary?: string;
}

export const getJobApplicants = (
  jobId: string
): Promise<{ items: ApplicantDto[] }> =>
  axiosClient
    .get<{ items: ApplicantDto[] }>(`/api/jobs/${jobId}/applicants`)
    .then((r) => r.data);

export const getMyJobs = (page = 1, pageSize = 20): Promise<unknown> =>
  axiosClient
    .get(`/api/jobs/mine`, { params: { page, pageSize } })
    .then((r) => r.data);

export interface PillarScore {
  weight: number;
  score: number;
}

export interface MatchScoreBreakdown {
  skillsCoverage: PillarScore;
  experienceFit: PillarScore;
  certificationMatch: PillarScore;
  domainTitleMatch: PillarScore;
}

export interface MatchScoreResponse {
  jobId: string;
  overallScore: number;
  breakdown: MatchScoreBreakdown;
  certificationWeightRedistributed: boolean;
}

export const getJobMatchScore = (jobId: string): Promise<MatchScoreResponse> =>
  axiosClient
    .get<MatchScoreResponse>(`/api/jobs/${jobId}/match-score`)
    .then((r) => r.data);
