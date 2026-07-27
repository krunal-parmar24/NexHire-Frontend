import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  submitApplication,
  getMyApplications,
  withdrawApplication,
  SubmitApplicationRequest,
  SubmitApplicationResponse,
  WithdrawApplicationResponse,
  ApplicationDto,
} from "../endpoints/applications";

export const useSubmitApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SubmitApplicationResponse,
    Error,
    SubmitApplicationRequest
  >({
    mutationFn: submitApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    },
  });
};

export const useMyApplications = () => {
  return useQuery<{ items: ApplicationDto[] }, Error>({
    queryKey: ["my-applications"],
    queryFn: getMyApplications,
  });
};

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<WithdrawApplicationResponse, Error, string>({
    mutationFn: withdrawApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    },
  });
};
