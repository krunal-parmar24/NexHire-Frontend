import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useRecruiterDashboard } from "../../api/hooks/useDashboard";
import { useMyJobsQuery } from "../../api/hooks/useJobs";
import UnverifiedBadge from "../../components/recruiter/UnverifiedBadge";
import PublicHeader from "../../components/PublicHeader";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  subtitle: string;
  accent: string;
}

const StatCard = ({ title, value, icon, subtitle, accent }: StatCardProps) => (
  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-slate-300 transition-colors">
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2 min-w-0">
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <p className={`text-4xl font-extrabold ${accent}`}>{value}</p>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${accent
          .replace("text-", "bg-")
          .replace("-600", "-50")}`}
      >
        <i className={`${icon} text-xl ${accent}`}></i>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const {
    data: dashboard,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useRecruiterDashboard();
  const { data: jobsData, isLoading: jobsLoading } = useMyJobsQuery(1, 5);

  useEffect(() => {
    document.title = "Recruiter Dashboard | NexHire";
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans pb-32">
      <PublicHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Recruiter Dashboard
          </h1>
          <p className="text-slate-500">
            Overview of your active job postings and applicants.
          </p>
        </div>

        {/* Unverified Banner */}
        {!dashboardLoading && dashboard?.verificationStatus !== "Verified" && (
          <UnverifiedBadge />
        )}

        {/* Stats Grid */}
        {dashboardLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton width="100%" height="9rem" className="rounded-3xl" />
            <Skeleton width="100%" height="9rem" className="rounded-3xl" />
            <Skeleton width="100%" height="9rem" className="rounded-3xl" />
            <Skeleton width="100%" height="9rem" className="rounded-3xl" />
          </div>
        ) : dashboardError ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 text-center font-semibold">
            Failed to load dashboard. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Active Jobs"
              value={dashboard?.activeJobPostings ?? 0}
              icon="pi pi-briefcase"
              subtitle="Currently accepting applications"
              accent="text-blue-600"
            />
            <StatCard
              title="Total Applicants"
              value={dashboard?.totalApplicants ?? 0}
              icon="pi pi-users"
              subtitle="Across all postings"
              accent="text-indigo-600"
            />
            <StatCard
              title="Pending Review"
              value={dashboard?.pendingReview ?? 0}
              icon="pi pi-clock"
              subtitle="Require your attention"
              accent="text-amber-600"
            />
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-slate-500">
                    Company Status
                  </p>
                  {dashboard?.verificationStatus === "Verified" ? (
                    <div className="flex items-center gap-2">
                      <i className="pi pi-verified text-emerald-500 text-xl"></i>
                      <p className="text-2xl font-extrabold text-emerald-600">
                        Verified
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <i className="pi pi-exclamation-circle text-amber-500 text-xl"></i>
                      <p className="text-2xl font-extrabold text-amber-600">
                        {dashboard?.verificationStatus ?? "Unverified"}
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-slate-400">
                    {dashboard?.verificationStatus === "Verified"
                      ? "Full platform access"
                      : "Awaiting admin approval"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Job Postings */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-slate-800">
              My Recent Postings
            </h2>
            {jobsData && jobsData.totalCount > 5 && (
              <span className="text-sm font-semibold text-slate-500">
                Showing 5 of {jobsData.totalCount}
              </span>
            )}
          </div>

          {jobsLoading ? (
            <div className="flex flex-col gap-4">
              <Skeleton
                width="100%"
                height="8rem"
                className="rounded-3xl shadow-sm"
              />
              <Skeleton
                width="100%"
                height="8rem"
                className="rounded-3xl shadow-sm"
              />
            </div>
          ) : !jobsData || jobsData.items.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 text-3xl mb-6">
                <i className="pi pi-briefcase"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                No active postings
              </h3>
              <p className="text-slate-500 max-w-md text-base mb-6">
                You haven&apos;t posted any jobs yet.
              </p>
              <Link to="/recruiter/jobs/new">
                <Button
                  label="Post your first job"
                  className="!rounded-xl !bg-blue-600 hover:!bg-blue-700 !border-none !text-white px-6 py-2.5 font-bold shadow-md"
                />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobsData.items.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center hover:border-slate-300 transition-colors"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {job.title}
                    </h3>
                    <div className="text-slate-500 font-medium mb-4 flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1">
                        <i className="pi pi-map-marker"></i> {job.location}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <i className="pi pi-briefcase"></i> {job.jobType}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Tag
                        value={job.status}
                        severity={
                          job.status === "Active"
                            ? "success"
                            : job.status === "Draft"
                            ? "info"
                            : "danger"
                        }
                        className="rounded-lg px-3 py-1 font-bold text-xs"
                      />
                      <span className="text-sm text-slate-400 font-medium">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 w-full sm:w-auto">
                    <Link
                      to={`/recruiter/jobs/${job.id}/applicants`}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        label="View Applicants"
                        icon="pi pi-users"
                        outlined
                        className="w-full sm:w-auto !border-slate-200 !text-slate-700 hover:!bg-slate-50 font-bold rounded-xl px-6 py-2.5"
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
