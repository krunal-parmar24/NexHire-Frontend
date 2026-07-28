import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useJobsQuery,
  useSavedJobIdsQuery,
  useToggleSaveJobMutation,
} from "../../api/hooks/useJobs";
import { useAuth } from "../../context/AuthContext";
import PublicHeader from "../../components/PublicHeader";
import { MatchScoreBadge } from "../../components/jobs/MatchScoreBadge";
import LoginRegisterModal from "../../components/auth/LoginRegisterModal";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Toast } from "primereact/toast";

export default function JobListingPage() {
  const { accessToken, role } = useAuth();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  // Filter States
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState<string | null>(null);
  const [remoteType, setRemoteType] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal State
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  // SEO
  useEffect(() => {
    document.title = "NexHire | Premium Tech Jobs Board";
  }, []);

  // Fetch Jobs
  const { data, isLoading, isError, refetch } = useJobsQuery({
    keyword: keyword || undefined,
    location: location || undefined,
    jobType: jobType || undefined,
    remoteType: remoteType || undefined,
    page,
    pageSize,
  });

  const jobTypes = [
    { label: "Full-time", value: "Full-time" },
    { label: "Part-time", value: "Part-time" },
    { label: "Contract", value: "Contract" },
  ];

  const remoteTypes = [
    { label: "Remote", value: "Remote" },
    { label: "Hybrid", value: "Hybrid" },
    { label: "Onsite", value: "Onsite" },
  ];

  const handleResetFilters = () => {
    setKeyword("");
    setLocation("");
    setJobType(null);
    setRemoteType(null);
    setPage(1);
  };

  const handlePageChange = (e: PaginatorPageChangeEvent) => {
    setPage(e.page + 1);
    setPageSize(e.rows);
  };

  const handleApply = (jobId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!accessToken) {
      sessionStorage.setItem(
        "nexhire_redirect_after_login",
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

  const { data: savedJobIds = [] } = useSavedJobIdsQuery(!!accessToken);
  const savedJobsSet = new Set(savedJobIds);
  const toggleSaveMutation = useToggleSaveJobMutation();

  const handleSave = (jobId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Toast ref={toast} />
      <PublicHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
        {/* Premium Dark Hero Section */}
        <section className="relative bg-slate-900 rounded-[2.5rem] p-10 md:p-20 text-center flex flex-col items-center justify-center overflow-hidden shadow-2xl">
          {/* Abstract Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

          <div className="relative z-10 max-w-3xl flex flex-col items-center gap-6">
            <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-semibold tracking-wide backdrop-blur-md">
              Over 10,000+ Premium Tech Jobs
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              Find Your Next <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Dream Career
              </span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              Explore premium roles curated with precision. Use our AI assistant
              to match, build resumes, and apply seamlessly.
            </p>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Filter Sidebar */}
          <aside className="w-full lg:w-[320px] bg-white border border-slate-200/60 rounded-3xl p-7 shadow-sm shrink-0 flex flex-col gap-7 sticky top-28">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Filters</h2>
              <button
                onClick={handleResetFilters}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {/* Keyword */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Search
                </label>
                <div className="relative w-full flex items-center">
                  <i className="pi pi-search text-slate-400 absolute left-3.5 z-10"></i>
                  <InputText
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Job title, keywords..."
                    className="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !py-3 !pl-10 !text-slate-700 !shadow-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Location
                </label>
                <div className="relative w-full flex items-center">
                  <i className="pi pi-map-marker text-slate-400 absolute left-3.5 z-10"></i>
                  <InputText
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setPage(1);
                    }}
                    placeholder="City, country or remote..."
                    className="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !py-3 !pl-10 !text-slate-700 !shadow-none"
                  />
                </div>
              </div>

              {/* Job Type */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Job Type
                </label>
                <Dropdown
                  value={jobType}
                  onChange={(e) => {
                    setJobType(e.value);
                    setPage(1);
                  }}
                  options={jobTypes}
                  placeholder="Any Job Type"
                  showClear
                  className="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !shadow-none"
                />
              </div>

              {/* Workplace Type */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Workplace
                </label>
                <Dropdown
                  value={remoteType}
                  onChange={(e) => {
                    setRemoteType(e.value);
                    setPage(1);
                  }}
                  options={remoteTypes}
                  placeholder="Any Workplace"
                  showClear
                  className="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !shadow-none"
                />
              </div>
            </div>
          </aside>

          {/* Right Column: Job Listings Grid */}
          <div className="flex-1 w-full flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold text-slate-800">
                Recommended Roles
              </h2>
              {data && (
                <span className="text-slate-500 font-medium">
                  {data.totalCount} jobs found
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="flex flex-col gap-5">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <Skeleton
                        shape="circle"
                        size="3.5rem"
                        className="shrink-0"
                      />
                      <div className="flex-1 space-y-3 pt-2">
                        <Skeleton
                          width="40%"
                          height="1.5rem"
                          className="rounded-lg"
                        />
                        <Skeleton
                          width="20%"
                          height="1rem"
                          className="rounded-lg"
                        />
                        <div className="flex gap-2 pt-2">
                          <Skeleton
                            width="5rem"
                            height="2rem"
                            className="rounded-full"
                          />
                          <Skeleton
                            width="5rem"
                            height="2rem"
                            className="rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="bg-white border border-red-100 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-2xl mb-4">
                  <i className="pi pi-exclamation-triangle"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Failed to load jobs
                </h3>
                <p className="text-slate-500 mb-6">
                  We encountered an issue fetching job postings.
                </p>
                <Button
                  label="Try Again"
                  onClick={() => refetch()}
                  className="!rounded-xl !bg-slate-900 !border-none px-6"
                />
              </div>
            ) : !data || data.items.length === 0 ? (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 text-3xl mb-6">
                  <i className="pi pi-search"></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                  No jobs found
                </h3>
                <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
                  We couldn&apos;t find any job postings matching your current
                  filters. Try adjusting your search criteria.
                </p>
                <Button
                  label="Clear Filters"
                  onClick={handleResetFilters}
                  outlined
                  className="!rounded-xl !border-slate-300 !text-slate-700 hover:!bg-slate-50 px-6"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {data.items.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="group bg-white border border-slate-200/60 hover:border-blue-300 hover:shadow-lg rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 transition-all duration-200 cursor-pointer relative"
                  >
                    {/* Company Logo Placeholder */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      <span className="text-xl font-black text-slate-400">
                        {job.companyName.charAt(0)}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <h3 className="text-xl font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap pt-1">
                            {new Date(job.createdAt).toLocaleDateString(
                              undefined,
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        </div>
                        <div className="text-slate-600 font-medium text-base mb-4 flex items-center gap-2">
                          {job.companyName}
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <i className="pi pi-map-marker text-xs"></i>{" "}
                            {job.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100/50">
                          {job.jobType}
                        </span>
                        <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100/50">
                          {job.remoteType}
                        </span>
                        <MatchScoreBadge jobId={job.id} />
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center justify-end gap-3 shrink-0 pt-4 sm:pt-0 sm:border-l sm:border-slate-100 sm:pl-6">
                      <Button
                        onClick={(e) => handleApply(job.id, e)}
                        label="Apply Now"
                        className="w-full sm:w-auto !rounded-xl !bg-blue-600 hover:!bg-blue-700 !border-none !text-white font-bold px-6 py-2.5 shadow-md shadow-blue-600/20"
                      />
                      <Button
                        onClick={(e) => handleSave(job.id, e)}
                        disabled={toggleSaveMutation.isPending}
                        icon={
                          savedJobsSet.has(job.id)
                            ? "pi pi-bookmark-fill"
                            : "pi pi-bookmark"
                        }
                        label={savedJobsSet.has(job.id) ? "Saved" : "Save"}
                        outlined={!savedJobsSet.has(job.id)}
                        className={`w-full sm:w-auto !rounded-xl font-semibold px-6 py-2.5 ${
                          savedJobsSet.has(job.id)
                            ? "!bg-blue-50 !text-blue-700 !border-blue-200"
                            : "!border-slate-200 !text-slate-600 hover:!bg-slate-50 hover:!border-slate-300"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {data && data.totalCount > pageSize && (
              <div className="mt-8 flex justify-center">
                <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
                  <Paginator
                    first={(page - 1) * pageSize}
                    rows={pageSize}
                    totalRecords={data.totalCount}
                    onPageChange={handlePageChange}
                    className="!border-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <LoginRegisterModal
        visible={loginModalVisible}
        onHide={() => setLoginModalVisible(false)}
      />
    </div>
  );
}
