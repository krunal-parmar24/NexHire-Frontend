import type { TagProps } from "primereact/tag";

/** Application status values, PrimeReact severity mapping, and pipeline stages.
 * Shared by MyApplicationsPage (seeker severity map) and JobApplicantsPage (recruiter pipeline). */
export const APPLICATION_STATUSES = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Hired",
  "Rejected",
  "Withdrawn",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** Status → PrimeReact Tag severity mapping. */
export const APPLICATION_STATUS_SEVERITY: Record<
  ApplicationStatus,
  TagProps["severity"]
> = {
  Applied: "info",
  Shortlisted: "warning",
  Interview: "info",
  Hired: "success",
  Rejected: "danger",
  Withdrawn: "secondary",
};

/** Statuses that allow withdrawal from the seeker side. */
export const WITHDRAWABLE_STATUSES: ApplicationStatus[] = [
  "Applied",
  "Shortlisted",
  "Interview",
];

/** Dropdown options for the recruiter pipeline stage selector. */
export const PIPELINE_STATUS_OPTIONS = APPLICATION_STATUSES.filter(
  (s) => s !== "Withdrawn"
).map((s) => ({ label: s, value: s }));
