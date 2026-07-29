import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getJobApplicants,
  ApplicantDto,
  getJobMatchScore,
  MatchScoreResponse,
  getJobsList,
  getJobById,
  getSavedJobIds,
  toggleSaveJob,
  getMyJobsList,
} from "../endpoints/jobs";
import type {
  JobListResponse,
  JobDetailResponse,
  JobsQueryFilters,
} from "../../types/job";

export type {
  JobListItem,
  JobListResponse,
  JobDetailResponse,
  JobsQueryFilters,
} from "../../types/job";

export const useJobsQuery = (filters: JobsQueryFilters) => {
  return useQuery<JobListResponse>({
    queryKey: ["jobs", filters],
    queryFn: () => getJobsList(filters),
  });
};

export const useJobQuery = (id: string) => {
  return useQuery<JobDetailResponse>({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
};

export const useSavedJobIdsQuery = (isAuthenticated: boolean) => {
  return useQuery<string[]>({
    queryKey: ["savedJobs"],
    queryFn: getSavedJobIds,
    enabled: isAuthenticated,
  });
};

export const useToggleSaveJobMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleSaveJob,
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
    onError: (_err, _variables, context) => {
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
    queryFn: () => getMyJobsList(page, pageSize),
  });
};

export const useMatchScoreQuery = (jobId: string, isAuthenticated: boolean) => {
  return useQuery<MatchScoreResponse, Error>({
    queryKey: ["match-score", jobId],
    queryFn: () => getJobMatchScore(jobId),
    enabled: !!jobId && isAuthenticated,
    retry: false,
  });
};
