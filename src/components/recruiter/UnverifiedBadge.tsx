import React from "react";
import { Tag } from "primereact/tag";

export default function UnverifiedBadge() {
  return (
    <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200/60 rounded-3xl shadow-sm">
      <Tag
        severity="warning"
        value="Unverified"
        icon="pi pi-exclamation-triangle"
        className="bg-amber-500 px-3 py-1 text-sm font-bold shrink-0"
      />
      <span className="text-sm font-medium text-amber-800">
        Your account is pending verification. Some features may be restricted.
      </span>
    </div>
  );
}
