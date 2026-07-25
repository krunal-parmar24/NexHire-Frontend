# Product Overview (Frontend)

**Derived from:** SRS v3.1 (§1), Implementation Plan v1.0 (§1)

> This file orients a Frontend-only AI coding agent on what the product is, why it exists, and where the frontend fits in the overall system. It does not restate backend implementation details beyond the integration points the frontend needs.

## 1. Purpose

The Agentic AI-Based Job Portal is a portfolio-grade demonstration of Agentic AI workflows: tool calling, human-in-the-loop (HITL) governance, streaming AI reasoning traces, and interactive candidate validation loops, presented to recruiters and interviewers. The UI's job is to make these differentiators **visible and legible** — not just functional.

## 2. Tech Stack (Frontend Slice)

| Concern | Technology |
|---|---|
| UI framework | React (Vite) + PrimeReact (components, dynamic form renderers, persistent chat panel) |
| Real-time | SignalR client (reasoning trace streaming, live status notifications) |
| Server state | React Query |
| Client/session state | React Context (auth) + Zustand (session, e.g. chat in-flight flag) |
| HTTP | Axios with interceptor for JWT attach/refresh |
| Deployment | Static bundle served via Nginx inside a Docker container, deployed to Render |

The backend is ASP.NET Core (C#) + EF Core + Supabase PostgreSQL/Storage + Redis + Microsoft Agent Framework + GitHub Models (GPT-4.1-mini). The frontend never talks to Supabase, Redis, or the LLM directly — everything goes through the backend's REST/SignalR API surface described in [14-api-contracts-frontend.md](14-api-contracts-frontend.md).

## 3. In-Scope Frontend Surfaces

- Guest job browsing/search (no auth) — SEO-crawlable.
- Login/Register modal with role-permanent selection and Quick Demo Login.
- Hard-wall onboarding wizard (Job Seeker & Recruiter variants).
- Dynamic screening-question form renderer (shared across recruiter builder, preview, and seeker application form).
- Job Seeker: applications list, withdraw action, profile editing.
- Recruiter: job posting wizard, screening question builder, applicant management (table/kanban), dashboard, company profile editing.
- Persistent chat icon → full-page chat UI with streamed reasoning traces, Review Card (autofill), Bulk Apply review, JD draft editor, Candidate Screening suggestion panel.
- Credit meter widget, "AI Busy"/"Coming Soon" states, notifications bell.
- Persistent AI-generated-content disclaimer.

## 4. Explicitly Out of Scope

Per SRS §9 — do not build UI for any of the following:

- Third-party OAuth SSO (Google/LinkedIn login buttons).
- Password-reset-by-email flow.
- Multi-recruiter/shared-company team UI.
- Real payment/checkout screens (only a "Coming Soon" placeholder is in scope).
- OCR upload flows for scanned/image PDFs.
- GDPR-style data export/delete UI.
- Admin analytics dashboards (admin scope is limited to recruiter verification approve/reject, which is a minimal panel, not a full dashboard).
- Deep mobile-responsive polish — basic usability (no broken layout/horizontal scroll) is the bar, not a responsive design system.

## 5. Core Features & Priority (Frontend-relevant)

| # | Feature | Priority |
|---|---|---|
| 1 | Guest browsing, manual search/filter | P0 |
| 2 | Login/Register + onboarding wizard + resume upload UI | P0 |
| 3 | Dynamic screening form (seeker + recruiter builder + preview) | P0 |
| 4 | Match score badge display | P0 |
| 5 | Agentic AI chat UI + streaming reasoning trace | P0 |
| 6 | Credit meter + rate-limit/"AI Busy" UI states | P0 |
| 7 | Recruiter job posting lifecycle UI + applicant pipeline UI | P0 |
| 8 | In-app notifications UI | P1 |
| 9 | Responsible-AI disclaimer | P1 |
| 10 | Deployment (static bundle to Render) | P0 |

## 6. Assumptions & Constraints Relevant to Frontend

- Solo developer/agent execution, 14-day timeline, manual testing only (no automated test suite in scope).
- LLM responses are streamed via SignalR — UI must render partial/streaming content, not just a final blob.
- Uploads capped at 1MB (resume/logo) — frontend must validate client-side before upload as a UX courtesy (server also enforces).
- Chat is limited to one in-flight request per session — UI must disable input while a request is processing.
- Credit quota (500/30 days) and platform rate limit (150/day, 10/min) are enforced server-side; frontend only needs to display balance/state and handle the corresponding blocked-action responses gracefully.

## See Also

- [08-frontend-folder-structure.md](08-frontend-folder-structure.md) — where this all lives in code.
- [09-implementation-plan-frontend-tracks.md](09-implementation-plan-frontend-tracks.md) — day-by-day build plan.
- [INDEX.md](INDEX.md) — full file index.
