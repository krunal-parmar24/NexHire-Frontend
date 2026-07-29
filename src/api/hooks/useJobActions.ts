import { RefObject } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToggleSaveJobMutation, useSavedJobIdsQuery } from "./useJobs";
import { Toast } from "primereact/toast";
import { STORAGE_KEYS } from "../../constants/storageKeys";

export function useJobActions(
  toast: RefObject<Toast | null>,
  setLoginModalVisible: (visible: boolean) => void
) {
  const navigate = useNavigate();
  const { accessToken, role } = useAuth();

  const { data: savedJobIds = [] } = useSavedJobIdsQuery(!!accessToken);
  const savedJobsSet = new Set(savedJobIds);
  const toggleSaveMutation = useToggleSaveJobMutation();

  const handleApply = (jobId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!accessToken) {
      sessionStorage.setItem(
        STORAGE_KEYS.REDIRECT_AFTER_LOGIN,
        `/seeker/apply/${jobId}`
      );
      setLoginModalVisible(true);
      toast.current?.show({
        severity: "info",
        summary: "Authentication Required",
        detail: "Please sign in or register to apply for this job.",
        life: 3000,
      });
    } else {
      if (role === "JobSeeker") {
        navigate(`/seeker/apply/${jobId}`);
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Action Restricted",
          detail: "Recruiter accounts cannot apply to jobs.",
          life: 4000,
        });
      }
    }
  };

  const handleSave = (jobId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!accessToken) {
      setLoginModalVisible(true);
      toast.current?.show({
        severity: "info",
        summary: "Authentication Required",
        detail: "Please sign in or register to save this job.",
        life: 3000,
      });
    } else {
      if (role === "Recruiter") {
        toast.current?.show({
          severity: "warn",
          summary: "Action Restricted",
          detail: "Recruiter accounts cannot save jobs.",
          life: 4000,
        });
        return;
      }

      toggleSaveMutation.mutate(jobId, {
        onSuccess: (data) => {
          toast.current?.show({
            severity: data.isSaved ? "success" : "info",
            summary: data.isSaved ? "Saved" : "Unsaved",
            detail: data.isSaved
              ? "Job saved successfully!"
              : "Job removed from saved list.",
            life: 2000,
          });
        },
        onError: () => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to update saved job status.",
            life: 3000,
          });
        },
      });
    }
  };

  return {
    savedJobsSet,
    handleApply,
    handleSave,
    isSaving: toggleSaveMutation.isPending,
  };
}
