import React, { useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useJobQuery } from "../../api/hooks/useJobs";
import { useSubmitApplication } from "../../api/hooks/useApplications";
import { DynamicFormRenderer } from "../../components/forms/DynamicFormRenderer";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { ScreeningAnswer } from "../../types/screeningQuestion";
import PublicHeader from "../../components/PublicHeader";

export default function ApplyToJobPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const { data: job, isLoading, isError } = useJobQuery(id || "");
  const submitApplication = useSubmitApplication();

  useEffect(() => {
    if (job?.title) {
      document.title = `Apply: ${job.title} | NexHire`;
    }
  }, [job]);

  const handleSubmit = (answers: ScreeningAnswer[]) => {
    if (!id) return;
    submitApplication.mutate(
      { jobId: id, answers },
      {
        onSuccess: () => {
          navigate("/seeker/applications", { state: { applied: true } });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          const msg =
            err.response?.data?.error?.message ||
            "Failed to submit application";
          toast.current?.show({
            severity: "error",
            summary: "Submission Failed",
            detail: msg,
            life: 5000,
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans pb-32">
        <PublicHeader />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10">
          <div className="text-center text-slate-500">Loading...</div>
        </main>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans pb-32">
        <PublicHeader />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10">
          <div className="text-center text-slate-500">Job not found.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans pb-32">
      <Toast ref={toast} />
      <PublicHeader />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10 flex flex-col gap-8">
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link
            to={`/jobs/${id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {job.title}
          </Link>
          <i className="pi pi-angle-right text-xs"></i>
          <span className="text-slate-800">Apply</span>
        </nav>

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Apply to {job.companyName}
          </h1>
          <p className="text-slate-600">
            Please fill out the following required screening questions.
          </p>
        </div>

        {/* AI Autofill Banner placeholder per KB 04 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-sm">
          <div>
            <h3 className="font-bold text-blue-900 text-lg mb-1 flex items-center gap-2">
              <i className="pi pi-sparkles text-blue-600"></i> Autofill with AI
            </h3>
            <p className="text-sm text-blue-700/80">
              Save time! Let NexHire AI draft answers based on your profile and
              resume.
            </p>
          </div>
          <Button
            label="Autofill Form"
            icon="pi pi-bolt"
            className="!bg-blue-600 hover:!bg-blue-700 !border-none text-white rounded-xl font-bold px-6 py-2.5 shrink-0 shadow-lg shadow-blue-600/20"
            disabled
          />
        </div>

        <DynamicFormRenderer
          mode="fill"
          questions={job.screeningQuestions || []}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
