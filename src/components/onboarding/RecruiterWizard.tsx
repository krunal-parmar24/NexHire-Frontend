import React, { useState } from "react";
import {
  useOnboardingRecruiterMutation,
  RecruiterFields,
} from "../../api/hooks/useOnboarding";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export default function RecruiterWizard() {
  const [formData, setFormData] = useState<RecruiterFields>({
    companyName: "",
    industry: "",
    size: "",
    designation: "",
  });
  const mutation = useOnboardingRecruiterMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const updateField = (field: keyof RecruiterFields, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 md:p-10 text-gray-900 border border-gray-100">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-0 pointer-events-none">
          <img
            src="/logo.png"
            alt="NexHire Logo"
            className="h-48 object-contain -mt-10 -mb-12"
          />
        </div>
        <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight mb-2">
          Recruiter Onboarding
        </h2>
        <p className="text-gray-500">
          Tell us about your company to start posting jobs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="animate-fadein space-y-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Company Name *
          </label>
          <InputText
            required
            value={formData.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
            className="w-full p-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Industry *
          </label>
          <InputText
            required
            value={formData.industry}
            onChange={(e) => updateField("industry", e.target.value)}
            className="w-full p-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Company Size (e.g. 50-200) *
          </label>
          <InputText
            required
            value={formData.size}
            onChange={(e) => updateField("size", e.target.value)}
            className="w-full p-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Your Designation *
          </label>
          <InputText
            required
            value={formData.designation}
            onChange={(e) => updateField("designation", e.target.value)}
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

        <div className="mt-8 pt-4">
          <Button
            type="submit"
            label="Complete Onboarding"
            className="w-full !bg-gradient-to-r !from-[#2563EB] !to-[#4F46E5] hover:!from-blue-700 hover:!to-indigo-700 !border-none py-3.5 text-base text-white font-bold rounded-xl shadow-md transition-transform active:scale-[0.98]"
            loading={mutation.isPending}
          />
        </div>
      </form>
    </div>
  );
}
