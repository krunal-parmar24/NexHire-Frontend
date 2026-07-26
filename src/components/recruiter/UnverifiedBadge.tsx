import React from "react";
import { Tag } from "primereact/tag";

export default function UnverifiedBadge() {
  return (
    <div className="flex items-center space-x-2 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
      <Tag severity="warning" value="Unverified" icon="pi pi-exclamation-triangle" className="bg-yellow-600" />
      <span className="text-sm text-yellow-200">
        Your account is pending verification. Some features may be restricted.
      </span>
    </div>
  );
}
