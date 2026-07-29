import React from "react";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  subtitle: string;
  accent: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  subtitle,
  accent,
}: StatCardProps) => (
  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-slate-300 transition-colors">
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2 min-w-0">
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <p className={`text-4xl font-extrabold ${accent}`}>{value}</p>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${accent
          .replace("text-", "bg-")
          .replace("-600", "-50")}`}
      >
        <i className={`${icon} text-xl ${accent}`}></i>
      </div>
    </div>
  </div>
);
