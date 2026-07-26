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
