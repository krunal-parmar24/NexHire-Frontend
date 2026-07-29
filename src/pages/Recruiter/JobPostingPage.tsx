import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { TiptapEditor } from "../../components/forms/TiptapEditor";
import { DynamicFormRenderer } from "../../components/forms/DynamicFormRenderer";
import { ScreeningQuestion } from "../../types/screeningQuestion";
import { useCreateJobMutation } from "../../api/hooks/useJobMutations";
import { JOB_TYPE_OPTIONS, REMOTE_TYPE_OPTIONS } from "../../constants/jobOptions";
import PublicHeader from "../../components/PublicHeader";

const JobPostingPage: React.FC = () => {
  const navigate = useNavigate();
  const createJob = useCreateJobMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [salaryRange, setSalaryRange] = useState("");
  const [remoteType, setRemoteType] = useState("Onsite");
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJob.mutate(
      {
        title,
        description,
        requirements,
        location,
        jobType,
        salaryRange,
        remoteType,
        screeningQuestions: questions,
      },
      {
        onSuccess: () => {
          navigate("/recruiter");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <PublicHeader />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Post a New Job
          </h1>
          <p className="text-slate-500">
            Create a new job posting and define custom screening questions for
            applicants.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Job Details Card */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-800 m-0">
              Job Details
            </h2>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">
                Job Title <span className="text-red-500">*</span>
              </label>
              <InputText
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !py-3 !shadow-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">
                Description <span className="text-red-500">*</span>
              </label>
              <TiptapEditor value={description} onChange={setDescription} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">
                Requirements <span className="text-red-500">*</span>
              </label>
              <TiptapEditor value={requirements} onChange={setRequirements} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  Location <span className="text-red-500">*</span>
                </label>
                <InputText
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. New York, NY or Remote"
                  className="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !py-3 !shadow-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  Salary Range
                </label>
                <InputText
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g. $120k - $150k"
                  className="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !py-3 !shadow-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  value={jobType}
                  options={JOB_TYPE_OPTIONS}
                  onChange={(e) => setJobType(e.value)}
                  className="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !shadow-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  Workplace Type <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  value={remoteType}
                  options={REMOTE_TYPE_OPTIONS}
                  onChange={(e) => setRemoteType(e.value)}
                  className="w-full !rounded-xl !border-slate-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-100 !shadow-none"
                />
              </div>
            </div>
          </div>

          <DynamicFormRenderer
            mode="builder"
            questions={questions}
            onChange={setQuestions}
          />

          <div className="flex items-center justify-end gap-4 mt-2">
            <Button
              type="button"
              label="Cancel"
              onClick={() => navigate("/recruiter")}
              outlined
              className="!rounded-xl !border-slate-300 !text-slate-700 hover:!bg-slate-50 px-6 py-3 font-bold"
            />
            <Button
              type="submit"
              label="Post Job"
              loading={createJob.isPending}
              className="!rounded-xl !bg-blue-600 hover:!bg-blue-700 !border-none !text-white px-8 py-3 font-bold shadow-md shadow-blue-600/20"
            />
          </div>
        </form>
      </main>
    </div>
  );
};

export default JobPostingPage;
