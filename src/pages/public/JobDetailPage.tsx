import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useJobQuery,
} from "../../api/hooks/useJobs";
import { useJobActions } from "../../api/hooks/useJobActions";
import { useAuth } from "../../context/AuthContext";
import PublicHeader from "../../components/PublicHeader";
import { MatchScoreBadge } from "../../components/jobs/MatchScoreBadge";
import LoginRegisterModal from "../../components/auth/LoginRegisterModal";

import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const toast = useRef<Toast>(null);


  const [loginModalVisible, setLoginModalVisible] = useState(false);


  const { data: job, isLoading, isError } = useJobQuery(id || "");


  useEffect(() => {
    if (job?.title) {
      document.title = `${job.title} at ${job.companyName} | NexHire`;
    } else {
      document.title = "Job Details | NexHire";
    }
  }, [job]);

  const { handleApply, handleSave, savedJobsSet, isSaving } = useJobActions(toast, setLoginModalVisible);
  const isSaved = id ? savedJobsSet.has(id) : false;

  const handleMessage = () => {
    if (!accessToken) {
      setLoginModalVisible(true);
      toast.current?.show({
        severity: "info",
        summary: "Authentication Required",
        detail: "Please sign in or register to message the recruiter.",
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "info",
        summary: "Messaging",
        detail: "Chat interface is loading...",
        life: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans pb-32">
      <Toast ref={toast} />
      <PublicHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Jobs
          </Link>
          <i className="pi pi-angle-right text-xs"></i>
          <span className="text-slate-800">
            {isLoading ? "Loading..." : job?.title || "Not Found"}
          </span>
        </nav>

        {isLoading ? (
          <div className="bg-white rounded-[2rem] border border-slate-200/60 p-10 shadow-sm flex flex-col gap-8">
            <div className="flex items-start gap-6">
              <Skeleton shape="circle" size="5rem" />
              <div className="flex-1 space-y-4 pt-2">
                <Skeleton width="40%" height="2.5rem" className="rounded-lg" />
                <Skeleton width="25%" height="1.5rem" className="rounded-lg" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton width="100%" height="1rem" className="rounded-lg" />
              <Skeleton width="90%" height="1rem" className="rounded-lg" />
              <Skeleton width="95%" height="1rem" className="rounded-lg" />
            </div>
          </div>
        ) : isError || !job ? (
          <div className="bg-white rounded-[2rem] border border-slate-200/60 p-20 text-center shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-3xl mb-6">
              <i className="pi pi-exclamation-circle"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Job Not Found
            </h3>
            <p className="text-slate-500 max-w-md mb-8 text-lg">
              The job posting you are looking for might have been closed,
              deleted, or expired.
            </p>
            <Button
              onClick={() => navigate("/")}
              label="Back to Jobs Board"
              className="!bg-slate-900 hover:!bg-slate-800 !border-none !text-white rounded-xl font-bold px-8 py-3"
            />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main Content Area */}
            <div className="flex-1 w-full flex flex-col gap-8">
              {/* Job Header Card */}
              <section className="bg-white border border-slate-200/60 rounded-[2rem] p-8 md:p-10 shadow-sm flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center shrink-0 shadow-inner">
                      <span className="text-3xl font-black text-slate-400">
                        {job.companyName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                        {job.title}
                      </h1>
                      <div className="text-lg font-medium text-slate-600">
                        {job.companyName}
                      </div>
                    </div>
                  </div>

                  {/* Share button (decorative for now) */}
                  <Button
                    icon="pi pi-share-alt"
                    rounded
                    text
                    severity="secondary"
                    className="!w-12 !h-12 !bg-slate-50 hover:!bg-slate-100 hidden md:flex shrink-0"
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <i className="pi pi-map-marker text-slate-400"></i>
                    <span className="text-sm font-semibold text-slate-700">
                      {job.location}
                    </span>
                  </div>
                  {job.salaryRange && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                      <i className="pi pi-money-bill text-slate-400"></i>
                      <span className="text-sm font-semibold text-slate-700">
                        {job.salaryRange}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-xl border border-blue-100/50">
                    <span className="text-sm font-bold text-blue-700">
                      {job.jobType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-50/50 rounded-xl border border-purple-100/50">
                    <span className="text-sm font-bold text-purple-700">
                      {job.remoteType}
                    </span>
                  </div>
                </div>
              </section>

              {/* Job Details Card */}
              <section className="bg-white border border-slate-200/60 rounded-[2rem] p-8 md:p-12 shadow-sm flex flex-col gap-10">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 mb-5">
                    About the Role
                  </h2>
                  <div
                    className="text-slate-600 leading-[1.8] text-[1.05rem] font-medium tiptap-content ProseMirror"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>

                <div className="h-px bg-slate-100 w-full"></div>

                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 mb-5">
                    Requirements
                  </h2>
                  <div
                    className="text-slate-600 leading-[1.8] text-[1.05rem] font-medium tiptap-content ProseMirror"
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </div>
              </section>
            </div>

            {/* Sidebar (Desktop Sticky) */}
            <aside className="w-full lg:w-[340px] shrink-0 sticky top-28 flex flex-col gap-6">
              <div className="bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-sm flex flex-col gap-6">
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Action Center
                </h3>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={(e) => handleApply(id || "", e)}
                    label="Apply for this role"
                    icon="pi pi-bolt"
                    className="w-full !rounded-xl !bg-blue-600 hover:!bg-blue-700 !border-none !text-white font-bold py-3.5 text-base shadow-lg shadow-blue-600/20"
                  />
                  <Button
                    onClick={(e) => handleSave(id || "", e)}
                    disabled={isSaving}
                    label={isSaved ? "Saved" : "Save Job"}
                    icon={isSaved ? "pi pi-bookmark-fill" : "pi pi-bookmark"}
                    outlined={!isSaved}
                    className={`w-full !rounded-xl font-semibold py-3 text-base ${
                      isSaved
                        ? "!bg-blue-50 !text-blue-700 !border-blue-200"
                        : "!border-slate-200 !text-slate-700 hover:!bg-slate-50 hover:!border-slate-300"
                    }`}
                  />
                </div>

                <div className="mt-4 pt-6 border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-500 mb-4">
                    Have questions about this role?
                  </p>
                  <Button
                    onClick={handleMessage}
                    label="Message Recruiter"
                    icon="pi pi-envelope"
                    outlined
                    className="w-full !rounded-xl !border-slate-200 !text-slate-700 hover:!bg-slate-50 hover:!border-slate-300 font-semibold py-3"
                  />
                </div>

                {/* AI Match Score Card — only visible to authenticated JobSeekers */}
                <MatchScoreBadge jobId={job.id} variant="sidebar" />
              </div>

              <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/20 rounded-full blur-[40px] mix-blend-screen"></div>
                <h3 className="font-bold text-lg mb-2">Build Your Resume</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Use our AI powered wizard to automatically build and optimize
                  your profile for roles like this.
                </p>
                <Link
                  to="/onboarding"
                  className="text-blue-400 font-bold hover:text-blue-300 text-sm flex items-center gap-2"
                >
                  Update Profile <i className="pi pi-arrow-right"></i>
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Mobile Sticky Action Bar */}
      {!isLoading && job && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 p-4 px-6 flex items-center justify-between z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pb-safe">
          <div className="w-full flex items-center justify-between gap-4 max-w-5xl mx-auto">
            <div className="hidden sm:block min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">
                {job.companyName}
              </span>
              <span className="text-sm font-extrabold text-slate-900 truncate block">
                {job.title}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
              <Button
                onClick={(e) => handleSave(id || "", e)}
                disabled={isSaving}
                icon={isSaved ? "pi pi-bookmark-fill" : "pi pi-bookmark"}
                outlined={!isSaved}
                className={`!w-12 !h-12 !rounded-xl shrink-0 p-0 ${
                  isSaved
                    ? "!bg-blue-50 !text-blue-700 !border-blue-200"
                    : "!border-slate-200 !text-slate-600 hover:!bg-slate-50"
                }`}
              />
              <Button
                onClick={(e) => handleApply(id || "", e)}
                label="Apply Now"
                className="!rounded-xl !bg-blue-600 hover:!bg-blue-700 !border-none !text-white font-bold px-8 py-3 shadow-md shadow-blue-600/20 flex-1 sm:flex-none"
              />
            </div>
          </div>
        </div>
      )}

      <LoginRegisterModal
        visible={loginModalVisible}
        onHide={() => setLoginModalVisible(false)}
      />
    </div>
  );
}
