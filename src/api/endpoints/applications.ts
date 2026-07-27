import api from "../axiosClient";

export interface AnswerDto {
  questionId: string;
  value: string;
}

export interface SubmitApplicationRequest {
  jobId: string;
  answers: AnswerDto[];
}

export interface SubmitApplicationResponse {
  applicationId: string;
  status: string;
}

export interface ApplicationDto {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: string;
  submittedAt: string;
}

export interface WithdrawApplicationResponse {
  status: string;
}

export const submitApplication = (
  data: SubmitApplicationRequest
): Promise<SubmitApplicationResponse> =>
  api
    .post<SubmitApplicationResponse>("/api/applications", data)
    .then((r) => r.data);

export const getMyApplications = (): Promise<{ items: ApplicationDto[] }> =>
  api
    .get<{ items: ApplicationDto[] }>("/api/applications/mine")
    .then((r) => r.data);

export const withdrawApplication = (
  id: string
): Promise<WithdrawApplicationResponse> =>
  api
    .patch<WithdrawApplicationResponse>(`/api/applications/${id}/withdraw`)
    .then((r) => r.data);
