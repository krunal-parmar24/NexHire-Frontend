import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useJobQuery } from "../../api/hooks/useJobs";
import { useSubmitApplication } from "../../api/hooks/useApplications";
import { DynamicFormRenderer } from "../../components/forms/DynamicFormRenderer";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { ScreeningAnswer } from "../../types/screeningQuestion";
import PublicHeader from "../../components/PublicHeader";
import { uploadResume } from "../../api/uploadResume";

export default function ApplyToJobPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const { data: job, isLoading, isError } = useJobQuery(id || "");
  const submitApplication = useSubmitApplication();

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (job?.title) {
      document.title = `Apply: ${job.title} | NexHire`;
    }
  }, [job]);

  const handleSubmit = async (answers: ScreeningAnswer[]) => {
    if (!id) return;
    if (!resumeFile) {
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Resume is required. Please upload your resume.",
        life: 5000,
      });
      return;
    }

    try {
      setIsUploading(true);
      const resumeUrl = await uploadResume(resumeFile, "applicant");

      submitApplication.mutate(
        { jobId: id, answers, resumeUrl },
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
          onSettled: () => setIsUploading(false),
        }
      );
    } catch (err: unknown) {
      setIsUploading(false);
      toast.current?.show({
        severity: "error",
        summary: "Upload Failed",
        detail: "Failed to upload resume. Please try again.",
        life: 5000,
      });
    }
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

        <div className="bg-white rounded-[2rem] border border-slate-200/60 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          {isUploading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <i className="pi pi-spin pi-spinner text-4xl text-blue-600 mb-4"></i>
              <p className="text-slate-700 font-medium">Uploading Resume...</p>
            </div>
          )}
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Resume <span className="text-red-500">*</span>
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            Please upload your resume in PDF format (Max 1MB).
          </p>
          <FileUpload
            mode="basic"
            name="resume"
            accept="application/pdf"
            maxFileSize={1000000}
            onSelect={(e) => setResumeFile(e.files[0])}
            onClear={() => setResumeFile(null)}
            chooseLabel={resumeFile ? resumeFile.name : "Choose Resume (PDF)"}
            className="w-full md:w-auto"
          />
        </div>

        <DynamicFormRenderer
          mode="fill"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          questions={(job.screeningQuestions as any) || []}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
