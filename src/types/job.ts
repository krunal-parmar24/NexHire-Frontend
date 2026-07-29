/** Shared Job-domain types mirroring backend DTOs.
 * These were previously scattered across api/hooks/useJobs.ts. */

export interface JobListItem {
  id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  remoteType: string;
  status: string;
  createdAt: string;
}

export interface JobListResponse {
  items: JobListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface JobDetailResponse {
  id: string;
  title: string;
  companyName: string;
  description: string;
  requirements: string;
  location: string;
  jobType: string;
  salaryRange?: string;
  remoteType: string;
  status: string;
  /** Uses the canonical ScreeningQuestion shape from types/screeningQuestion.ts */
  screeningQuestions: import("./screeningQuestion").ScreeningQuestion[];
}

export interface JobsQueryFilters {
  keyword?: string;
  location?: string;
  jobType?: string;
  remoteType?: string;
  page?: number;
  pageSize?: number;
}
