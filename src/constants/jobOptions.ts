/** Shared dropdown options for Job Type and Workplace Type selects.
 * Used by JobListingPage (filter sidebar) and JobPostingPage (job form). */
export const JOB_TYPE_OPTIONS = [
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Contract", value: "Contract" },
];

export const REMOTE_TYPE_OPTIONS = [
  { label: "Remote", value: "Remote" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "Onsite", value: "Onsite" },
];

export type JobType = "Full-time" | "Part-time" | "Contract";
export type RemoteType = "Remote" | "Hybrid" | "Onsite";
