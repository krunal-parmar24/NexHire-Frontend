import React from "react";

interface Props {
  onSelect: (role: "JobSeeker" | "Recruiter") => void;
}

export default function RoleSelectionCards({ onSelect }: Props) {
  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ border: "1px solid #ddd", padding: 16, flex: 1 }}>
        <h3>I&apos;m looking for a job</h3>
        <p>Apply to jobs and build your profile</p>
        <button onClick={() => onSelect("JobSeeker")}>Select</button>
      </div>
      <div style={{ border: "1px solid #ddd", padding: 16, flex: 1 }}>
        <h3>I&apos;m hiring</h3>
        <p>Post jobs and manage applicants</p>
        <button onClick={() => onSelect("Recruiter")}>Select</button>
      </div>
    </div>
  );
}
