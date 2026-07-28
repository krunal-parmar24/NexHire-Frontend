import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axiosClient";
import { getJobApplicants, ApplicantDto } from "../endpoints/jobs";

export interface ScreeningQuestion {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

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
  screeningQuestions: ScreeningQuestion[];
}

export interface JobsQueryFilters {
  keyword?: string;
  location?: string;
  jobType?: string;
  remoteType?: string;
  page?: number;
  pageSize?: number;
}

export const useJobsQuery = (filters: JobsQueryFilters) => {
  return useQuery<JobListResponse>({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const res = await api.get<JobListResponse>("/api/jobs", {
        params: filters,
      });
      return res.data;
    },
  });
};

export const useJobQuery = (id: string) => {
  return useQuery<JobDetailResponse>({
    queryKey: ["job", id],
    queryFn: async () => {
      const res = await api.get<JobDetailResponse>(`/api/jobs/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useSavedJobIdsQuery = (isAuthenticated: boolean) => {
  return useQuery<string[]>({
    queryKey: ["savedJobs"],
    queryFn: async () => {
      const res = await api.get<string[]>("/api/jobs/saved");
      return res.data;
    },
    enabled: isAuthenticated,
  });
};

export const useToggleSaveJobMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      const res = await api.post<{ isSaved: boolean }>(
        `/api/jobs/${jobId}/save`
      );
      return { jobId, isSaved: res.data.isSaved };
    },
    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: ["savedJobs"] });
      const previousSavedJobs = queryClient.getQueryData<string[]>([
        "savedJobs",
      ]);

      queryClient.setQueryData<string[]>(["savedJobs"], (old) => {
        if (!old) return [];
        return old.includes(jobId)
          ? old.filter((id) => id !== jobId)
          : [...old, jobId];
      });

      return { previousSavedJobs };
    },
    onError: (err, variables, context) => {
      if (context?.previousSavedJobs) {
        queryClient.setQueryData(["savedJobs"], context.previousSavedJobs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
    },
  });
};

export const useJobApplicantsQuery = (jobId: string) => {
  return useQuery<{ items: ApplicantDto[] }, Error>({
    queryKey: ["job-applicants", jobId],
    queryFn: () => getJobApplicants(jobId),
    enabled: !!jobId,
  });
};

export const useMyJobsQuery = (page = 1, pageSize = 20) => {
  return useQuery<JobListResponse>({
    queryKey: ["my-jobs", page, pageSize],
    queryFn: async () => {
      const res = await api.get<JobListResponse>("/api/jobs/mine", {
        params: { page, pageSize },
      });
      return res.data;
    },
  });
};
