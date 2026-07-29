import React, { useState, useRef, useEffect } from "react";
import { useMatchScoreQuery } from "../../api/hooks/useJobs";
import { useAuth } from "../../context/AuthContext";
import { MatchScoreResponse, MatchScoreBreakdown } from "../../api/endpoints/jobs";

interface MatchScoreBadgeProps {
  jobId: string;
  prefetchedScore?: MatchScoreResponse;
  /** "inline" is for job cards; "sidebar" is for the detail page action panel */
  variant?: "inline" | "sidebar";
}

const PILLAR_LABELS: Record<keyof MatchScoreBreakdown, string> = {
  skillsCoverage: "Skills Match",
  experienceFit: "Experience",
  certificationMatch: "Certifications",
  domainTitleMatch: "Role Alignment",
};

const PILLAR_ICONS: Record<keyof MatchScoreBreakdown, string> = {
  skillsCoverage: "pi-code",
  experienceFit: "pi-briefcase",
  certificationMatch: "pi-verified",
  domainTitleMatch: "pi-compass",
};

function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 55) return "#f59e0b";
  return "#ef4444";
}

function scoreBg(score: number): string {
  if (score >= 80) return "#dcfce7";
  if (score >= 55) return "#fef9c3";
  return "#fee2e2";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Strong Match";
  if (score >= 55) return "Partial Match";
  return "Weak Match";
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  jobId,
  prefetchedScore,
  variant = "inline",
}) => {
  const { accessToken } = useAuth();
  const isAuthenticated = !!accessToken;
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside — runs in bubble phase so card's
  // capture-phase handler never sees it.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  const shouldFetch = isAuthenticated && !prefetchedScore;
  const { data: queryScore, isLoading } = useMatchScoreQuery(
    jobId,
    shouldFetch
  );

  if (!isAuthenticated) return null;

  const scoreData = prefetchedScore ?? queryScore;

  if (isLoading && !prefetchedScore) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 animate-pulse">
        <span className="w-3 h-3 rounded-full bg-slate-300" />
        <span className="w-16 h-3 rounded bg-slate-300 inline-block" />
      </div>
    );
  }

  if (!scoreData) return null;

  const { overallScore, breakdown, certificationWeightRedistributed } =
    scoreData;

  const pillars: {
    key: keyof MatchScoreBreakdown;
    score: number;
    weight: number;
  }[] = [
    { key: "skillsCoverage", ...breakdown.skillsCoverage },
    { key: "experienceFit", ...breakdown.experienceFit },
    { key: "certificationMatch", ...breakdown.certificationMatch },
    { key: "domainTitleMatch", ...breakdown.domainTitleMatch },
  ];

  const color = getScoreColor(overallScore);
  const bg = scoreBg(overallScore);
  const label = scoreLabel(overallScore);

  /* -----------------------------------------------------------------------
   * SIDEBAR variant — used on JobDetailPage
   * Renders a card that expands an inline breakdown panel.
   * No floating panel → no scroll-detach issue.
   * ----------------------------------------------------------------------- */
  if (variant === "sidebar") {
    return (
      // stopPropagation so clicks here never bubble to parent page elements
      <div
        ref={wrapperRef}
        onClick={(e) => e.stopPropagation()}
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: color + "40", backgroundColor: bg }}
      >

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          className="w-full p-5 flex flex-col gap-4 cursor-pointer hover:brightness-95 transition-all text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: color + "20" }}
              >
                <i className="pi pi-chart-bar text-sm" style={{ color }} />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider m-0">
                  AI Match Score
                </p>
                <p className="text-xs text-slate-400 m-0">
                  Your profile vs. this job
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-black" style={{ color }}>
                {overallScore}%
              </span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ color, backgroundColor: color + "15" }}
              >
                {label}
              </span>
            </div>
          </div>

          <div className="w-full h-2 bg-white/70 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${overallScore}%`, backgroundColor: color }}
            />
          </div>

          <p className="text-xs text-slate-500 text-center m-0">
            {open ? "▲ Hide breakdown" : "▼ View pillar breakdown"}
          </p>
        </button>


        {open && (
          <div
            className="border-t px-5 pb-5 pt-4 bg-white/60"
            style={{ borderColor: color + "30" }}
          >
            <ScoreBreakdownPanel
              pillars={pillars}
              certificationWeightRedistributed={
                certificationWeightRedistributed
              }
              overallScore={overallScore}
              scoreColor={color}
            />
          </div>
        )}
      </div>
    );
  }

  /* -----------------------------------------------------------------------
   * INLINE variant — used on JobListingPage job cards
   * Renders a pill badge; clicking shows an absolutely-positioned dropdown
   * anchored to the badge itself. stopPropagation blocks card navigation.
   * ----------------------------------------------------------------------- */
  return (
    // This wrapper intercepts ALL click events so nothing bleeds to the card
    <div
      ref={wrapperRef}
      className="relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border transition-all hover:scale-105 active:scale-95"
        style={{ color, backgroundColor: bg, borderColor: color + "50" }}
        title="View your AI match score"
      >
        <i className="pi pi-sparkles text-xs" />
        <span>{overallScore}% Match</span>
      </button>


      {open && (
        <div
          className="absolute left-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100"
          style={{ width: "320px", top: "100%" }}
          // Prevent any click inside from escaping
          onClick={(e) => e.stopPropagation()}
        >

          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 m-0">
                AI Match Breakdown
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 m-0">
                How your profile compares to this job
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="text-2xl font-black leading-none"
                style={{ color }}
              >
                {overallScore}%
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors shrink-0"
                title="Close"
              >
                <i className="pi pi-times text-xs" />
              </button>
            </div>
          </div>

          <div className="px-4 pb-4">

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full rounded-full"
                style={{ width: `${overallScore}%`, backgroundColor: color }}
              />
            </div>

            <ScoreBreakdownPanel
              pillars={pillars}
              certificationWeightRedistributed={
                certificationWeightRedistributed
              }
              overallScore={overallScore}
              scoreColor={color}
              hideHeader
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface PillarItem {
  key: string;
  weight: number;
  score: number;
}

interface BreakdownPanelProps {
  pillars: PillarItem[];
  certificationWeightRedistributed: boolean;
  overallScore: number;
  scoreColor: string;
  hideHeader?: boolean;
}

const ScoreBreakdownPanel: React.FC<BreakdownPanelProps> = ({
  pillars,
  certificationWeightRedistributed,
  overallScore,
  scoreColor,
  hideHeader = false,
}) => (
  <div>
    {!hideHeader && (
      <>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 m-0">
              AI Match Breakdown
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 m-0">
              How your profile compares to this job
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span
              className="text-2xl font-black leading-none"
              style={{ color: scoreColor }}
            >
              {overallScore}%
            </span>
            <span className="text-xs text-slate-400">overall</span>
          </div>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
          <div
            className="h-full rounded-full"
            style={{ width: `${overallScore}%`, backgroundColor: scoreColor }}
          />
        </div>
      </>
    )}

    <div className="flex flex-col gap-3">
      {pillars.map((p) => {
        const isZero = p.weight === 0;
        const pColor = getScoreColor(p.score);
        return (
          <div key={p.key} className={isZero ? "opacity-40" : ""}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <i
                  className={`pi ${PILLAR_ICONS[p.key as keyof MatchScoreBreakdown]} text-slate-400`}
                  style={{ fontSize: "0.7rem" }}
                />
                <span className="text-xs font-semibold text-slate-700">
                  {PILLAR_LABELS[p.key as keyof MatchScoreBreakdown]}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  ({p.weight}%)
                </span>
              </div>
              <span className="text-xs font-bold" style={{ color: pColor }}>
                {p.score}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${p.score}%`, backgroundColor: pColor }}
              />
            </div>
          </div>
        );
      })}
    </div>

    {certificationWeightRedistributed && (
      <div className="mt-4 flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
        <i
          className="pi pi-info-circle text-slate-400 mt-0.5"
          style={{ fontSize: "0.75rem" }}
        />
        <p className="text-[11px] text-slate-500 leading-relaxed m-0">
          No certification required for this role — weight redistributed to
          Skills &amp; Experience.
        </p>
      </div>
    )}

    <p className="text-[10px] text-slate-400 text-center mt-4 m-0">
      Powered by NexHire AI · Based on your profile
    </p>
  </div>
);


