# Implementation Plan — Frontend Track (Day 1–14)

**Derived from:** Implementation Plan v1.0 §3 (Development Plan), §4.1–§4.6 (Task Breakdown), §5 (Development Order)

> Day numbering is identical to the Backend track ([10-implementation-plan-backend-tracks.md in backend KB]) for cross-team traceability. Each day lists only the Frontend-owned work; Backend tasks for the same day live in the Backend knowledge base.

## Day 1 — Project Scaffolding & Auth Foundations

- Init React + Vite + PrimeReact project.
- Set up routing skeleton (Public / Auth / Job Seeker / Recruiter route groups).
- Build auth context + Axios interceptor for JWT attach/refresh.
- Build Landing page shell, Login/Register modal components, role-selection cards.
- **Deliverable:** empty dashboards reachable; register/login UI wired to backend JWT issuance.
- **DoD:** frontend stores/attaches JWT correctly after login/register.

## Day 2 — Onboarding Hard-Wall & Resume Parsing

- [x] Build multi-step onboarding wizard (Job Seeker & Recruiter variants).
- [x] Build resume upload widget (max 1MB client-side check) + auto-fill review UI.
- [x] Build onboarding hard-wall route guard blocking all navigation until complete.
- **Deliverable:** new users forced through onboarding; resume auto-fills fields.
- **DoD:** onboarding blocks all navigation until submitted; resume parse populates ≥5 profile fields correctly on a sample resume.

## Day 3 — Guest Browsing, Search & Job Listings

- [x] Build job listing page (guest-accessible), job detail page, filter sidebar.
- [x] Add SEO-friendly meta tags / crawlable content.
- [x] Build gated Apply/Save/Message buttons (visible to guests, trigger login modal).
- **Deliverable:** public job board live with search/filter.
- **DoD:** guest sees jobs, filters work, restricted actions open login modal preserving job context.

## Day 4 — Recruiter Job Posting & Dynamic Builder

- [x] **Pages:** Build job posting form (`Title`, `Description`, `Requirements`, `Location`, `Job Type`, `Salary`, `Remote`).
- [x] **Components:** Build `DynamicFormRenderer.tsx` (builder mode).
- [x] **Components:** Implement the 6 field types (text, single-select, multi-select, file, yes/no, numeric) and preset question library.
- [x] **State:** Wire job creation/update to `POST /api/jobs` and `PUT /api/jobs/{id}`.
- **Deliverable:** recruiter can publish a job with a custom screening form.
- **DoD:** preview matches seeker-side renderer exactly.

## Day 5 — Dynamic Application Form & Submission Rules

- Build dynamic form renderer (shared component with builder) bound to `screening_questions`.
- Build application confirmation screen.
- Build "My Applications" list with withdraw action.
- **Deliverable:** end-to-end manual apply flow (no AI) fully functional.
- **DoD:** seeker can apply, view status, withdraw; withdrawn applications remain visible to recruiter.

## Day 6 — Applicant Management & Recruiter Dashboard

- Build Applicant Management table (per job), status dropdown/kanban.
- Build Recruiter Dashboard home with quick links.
- **Deliverable:** recruiter can manage full applicant lifecycle.
- **DoD:** all pipeline states reachable; dashboard counts match backend truth.

## Day 7 — ATS Match Scoring Engine (Display)

- Build match score badge on job cards/listing (seeker view).
- Build percentage badge/tooltip breakdown by pillar.
- **Deliverable:** match score badge renders correctly for any (user, job) pair returned by the backend.
- **DoD:** badge display verified against 3+ manual test cases including a no-cert redistribution case.

## Day 8 — Agent Framework Shell + Job Search/Match & Autofill Tools (Frontend)

- Build persistent chat icon (bottom-right) → full-page chat route.
- Build SignalR client connection.
- Build streaming reasoning-trace renderer.
- Build credit meter widget.
- **Deliverable:** working chatbot UI with live reasoning stream and functional display of the first 2 tools' results.
- **DoD:** single in-flight request enforced in the UI; rate-limit and credit-exhaustion UI states verified.

## Day 9 — Autofill Review Loop + Bulk Apply + JD Generation (Frontend)

- Build Review Card component with inline edit + "save to profile" toggle.
- Build Bulk Apply batch review screen.
- Build JD Generation panel in job posting form (draft → editable → publish).
- **Deliverable:** seeker autofill end-to-end UI; recruiter can AI-draft a JD.
- **DoD:** no auto-submission without an explicit confirm click at every irreversible UI step.

## Day 10 — Status Tool, Candidate Screening Tool & Notifications (Frontend)

- Build notification bell/dropdown.
- Build Candidate Screening suggestion panel in Applicant Management.
- Add chat query support display for "what's my application status".
- **Deliverable:** all 6 agent tools' results are correctly rendered in the UI; notifications functional.
- **DoD:** screening suggestions never auto-change status in the UI.

## Day 11 — Responsible AI Disclaimer, Admin Verification UI, Profile Editing

- Build persistent AI disclaimer footer component (chat + inline near AI-drafted content).
- Build profile edit screens (seeker & recruiter).
- Build admin verification mini-panel.
- **Deliverable:** full profile lifecycle UI + compliance banners across all AI surfaces.
- **DoD:** disclaimer visible on every AI output surface without exception.

## Day 12 — Hardening: Error Handling & Guardrail UI

- Build Upgrade/"Coming Soon" prompt on zero credits.
- Build "AI Busy" toast.
- Build inline error states for failed AI calls across all AI surfaces (no silent failures).
- **Deliverable:** no unhandled exceptions in any UI flow; all guardrail UI states verified.
- **DoD:** zero critical bugs in manual regression checklist (frontend scope).

## Day 13 — Deployment & End-to-End Integration

- Build production bundle; deploy static bundle to Render (see [16-deployment-frontend.md](16-deployment-frontend.md)).
- Point `VITE_API_BASE_URL` to the deployed backend.
- Verify SEO meta tags render on production job pages.
- **Deliverable:** live production URL with seeded demo data reachable from the frontend.
- **DoD:** Quick Demo Login works for both roles; no console errors.

## Day 14 — Final Polish, Documentation & Demo Readiness

- UI polish pass (spacing, empty states, loading skeletons).
- Basic mobile usability check (no broken layout/horizontal scroll — not deep responsive polish).
- Final visual QA across guest/seeker/recruiter journeys.
- **Deliverable:** production-ready, demo-ready frontend.
- **DoD:** all frontend-relevant items in the Section 7 Acceptance Criteria table pass; demo script runs without failure.

## Development Order Notes (Frontend-Relevant)

- Once a backend entity + DTO contract is defined (even before full backend implementation), the frontend can build against mocked responses matching that contract — this applies notably to Days 4–10, and is the key parallelization mechanism between tracks.
- Frontend chat shell (Day 8) can be built in parallel with backend orchestrator work once the SignalR hub contract is defined.

## Week 1 / Week 2 Milestones (Frontend Scope)

- **Week 1 (Days 1–7):** Auth/onboarding UI, guest browsing/search, recruiter job posting + screening builder, job seeker manual apply flow, applicant management + dashboard, ATS score badge — all live.
- **Week 2 (Days 8–14):** All 6 tool result UIs live with streamed reasoning traces, HITL guardrails enforced in UI, credit meter + disclaimer live, notifications + profile management complete, hardened error/guardrail UI states, production deployment.
