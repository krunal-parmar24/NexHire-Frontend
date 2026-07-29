import api from "../axiosClient";
import type {
  JobListResponse,
  JobDetailResponse,
  JobsQueryFilters,
} from "../../types/job";
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
  api.post<JobResponse>("/api/jobs", data).then((r) => r.data);

export const updateJob = (
  id: string,
  data: CreateJobRequest
): Promise<JobResponse> =>
  api.put<JobResponse>(`/api/jobs/${id}`, data).then((r) => r.data);

export const getJobsList = (
  filters: JobsQueryFilters
): Promise<JobListResponse> =>
  api
    .get<JobListResponse>("/api/jobs", { params: filters })
    .then((r) => r.data);

export const getJobById = (id: string): Promise<JobDetailResponse> =>
  api.get<JobDetailResponse>(`/api/jobs/${id}`).then((r) => r.data);

export const getSavedJobIds = (): Promise<string[]> =>
  api.get<string[]>("/api/jobs/saved").then((r) => r.data);

export const toggleSaveJob = (
  jobId: string
): Promise<{ jobId: string; isSaved: boolean }> =>
  api
    .post<{ isSaved: boolean }>(`/api/jobs/${jobId}/save`)
    .then((r) => ({ jobId, isSaved: r.data.isSaved }));

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
  api
    .get<{ items: ApplicantDto[] }>(`/api/jobs/${jobId}/applicants`)
    .then((r) => r.data);

export const getMyJobsList = (
  page = 1,
  pageSize = 20
): Promise<JobListResponse> =>
  api
    .get<JobListResponse>(`/api/jobs/mine`, { params: { page, pageSize } })
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
  api
    .get<MatchScoreResponse>(`/api/jobs/${jobId}/match-score`)
    .then((r) => r.data);
