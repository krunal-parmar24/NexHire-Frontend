import React, { useState } from "react";
import ResumeUploadWidget from "./ResumeUploadWidget";
import {
  useOnboardingJobSeekerMutation,
  ParsedFields,
} from "../../api/hooks/useOnboarding";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";

export default function JobSeekerWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ParsedFields>({});
  const mutation = useOnboardingJobSeekerMutation();

  const handleParseSuccess = (parsedData: ParsedFields) => {
    setFormData((prev) => ({ ...prev, ...parsedData }));
    setStep(2);
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const updateField = <K extends keyof ParsedFields>(
    field: K,
    value: ParsedFields[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-10 text-gray-900 border border-gray-100">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-0 pointer-events-none">
          <img
            src="/logo.png"
            alt="NexHire Logo"
            className="h-48 object-contain -mt-10 -mb-12"
          />
        </div>
        <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight mb-2">
          Welcome to NexHire
        </h2>
        <p className="text-gray-500">
          Let&apos;s set up your profile to find the best matches.
        </p>
      </div>

      {step === 1 && (
        <div className="animate-fadein">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Step 1: Upload Resume (Optional)
          </h3>
          <ResumeUploadWidget onParseSuccess={handleParseSuccess} />

          <div className="mt-6 flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">
              Save time with AI auto-fill
            </span>
            <Button
              label="Skip"
              className="p-button-text text-gray-500 hover:text-gray-700"
              onClick={handleNext}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
          className="animate-fadein space-y-5"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Step 2: Basic Info
          </h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Full Name *
            </label>
            <InputText
              required
              value={formData.fullName || ""}
              onChange={(e) => updateField("fullName", e.target.value)}
              className="w-full p-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Phone</label>
            <InputText
              value={formData.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full p-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Current Title *
            </label>
            <InputText
              required
              value={formData.currentTitle || ""}
              onChange={(e) => updateField("currentTitle", e.target.value)}
              className="w-full p-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Total Experience (Years)
            </label>
            <InputText
              type="number"
              value={formData.totalExperienceYears?.toString() || ""}
              onChange={(e) =>
                updateField("totalExperienceYears", parseInt(e.target.value))
              }
              className="w-full p-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
            />
          </div>

          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              label="Back"
              className="p-button-text text-gray-500 hover:text-gray-700"
              onClick={handleBack}
            />
            <Button
              type="submit"
              label="Next"
              className="!bg-gradient-to-r !from-[#2563EB] !to-[#4F46E5] hover:!from-blue-700 hover:!to-indigo-700 !border-none px-6 py-3 rounded-xl font-bold shadow-md transition-transform active:scale-[0.98] text-white"
            />
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="animate-fadein space-y-5">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Step 3: Professional Details
          </h3>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Skills (Press Enter)
            </label>
            <Chips
              value={formData.skills || []}
              onChange={(e) => updateField("skills", e.value)}
              className="w-full"
              pt={{
                container: {
                  className:
                    "w-full p-2 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-100 shadow-sm",
                },
                token: {
                  className: "bg-indigo-100 text-indigo-700 font-medium",
                },
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Preferred Location
            </label>
            <InputText
              value={formData.preferredLocation || ""}
              onChange={(e) => updateField("preferredLocation", e.target.value)}
              className="w-full p-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Expected Salary Range
            </label>
            <InputText
              value={formData.expectedSalaryRange || ""}
              onChange={(e) =>
                updateField("expectedSalaryRange", e.target.value)
              }
              className="w-full p-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
            />
          </div>

          {mutation.isError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm flex items-start gap-3 border border-red-100 mt-2">
              <i className="pi pi-exclamation-circle mt-0.5 text-red-500"></i>
              <span className="font-medium">
                Failed to submit profile. Please try again.
              </span>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              label="Back"
              className="p-button-text text-gray-500 hover:text-gray-700"
              onClick={handleBack}
              disabled={mutation.isPending}
            />
            <Button
              type="submit"
              label="Complete Onboarding"
              className="!bg-gradient-to-r !from-[#2563EB] !to-[#4F46E5] hover:!from-blue-700 hover:!to-indigo-700 !border-none px-6 py-3 rounded-xl font-bold shadow-md transition-transform active:scale-[0.98] text-white"
              loading={mutation.isPending}
            />
          </div>
        </form>
      )}
    </div>
  );
}
