import { useQuery } from "@tanstack/react-query";
import { getRecruiterDashboard, DashboardResponse } from "../endpoints/dashboard";

export const useRecruiterDashboard = () => {
  return useQuery<DashboardResponse, Error>({
    queryKey: ["dashboard", "recruiter"],
    queryFn: getRecruiterDashboard,
  });
};
