import React from "react";

interface RoleSelectionCardsProps {
  selectedRole: "JobSeeker" | "Recruiter";
  onSelect: (role: "JobSeeker" | "Recruiter") => void;
}

export default function RoleSelectionCards({
  selectedRole,
  onSelect,
}: RoleSelectionCardsProps) {
  const handleKeyDown =
    (role: "JobSeeker" | "Recruiter") =>
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(role);
      }
    };

  return (
    <div className="flex gap-4">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={selectedRole === "JobSeeker"}
        className={`flex-1 cursor-pointer transition-all border-2 rounded-xl bg-white shadow-sm hover:shadow-md ${
          selectedRole === "JobSeeker"
            ? "border-indigo-500 shadow-md ring-2 ring-indigo-200"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => onSelect("JobSeeker")}
        onKeyDown={handleKeyDown("JobSeeker")}
      >
        <div className="text-center p-4">
          <i
            className={`pi pi-briefcase text-3xl mb-3 ${
              selectedRole === "JobSeeker" ? "text-indigo-600" : "text-gray-500"
            }`}
          ></i>
          <h3 className="text-lg font-bold mb-1 text-gray-800">
            Looking for a job
          </h3>
          <p className="text-sm text-gray-500">
            Apply to jobs and build your profile
          </p>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-pressed={selectedRole === "Recruiter"}
        className={`flex-1 cursor-pointer transition-all border-2 rounded-xl bg-white shadow-sm hover:shadow-md ${
          selectedRole === "Recruiter"
            ? "border-indigo-500 shadow-md ring-2 ring-indigo-200"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => onSelect("Recruiter")}
        onKeyDown={handleKeyDown("Recruiter")}
      >
        <div className="text-center p-4">
          <i
            className={`pi pi-users text-3xl mb-3 ${
              selectedRole === "Recruiter" ? "text-indigo-600" : "text-gray-500"
            }`}
          ></i>
          <h3 className="text-lg font-bold mb-1 text-gray-800">
            I&apos;m hiring
          </h3>
          <p className="text-sm text-gray-500">
            Post jobs and manage applicants
          </p>
        </div>
      </div>
    </div>
  );
}
