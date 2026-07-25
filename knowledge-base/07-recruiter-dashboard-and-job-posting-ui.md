# Recruiter Dashboard & Job Posting UI (Frontend)

**Derived from:** SRS v3.1 §7 (Recruiter — Job Posting & Applicant Management)

## 1. Job Posting — Create, Edit, Publish

- Recruiter creates a job posting with: Title, Description, Requirements, Location, Job Type (Full-time/Part-time/Contract), Salary Range, Remote/Hybrid/Onsite.
- Optional AI assist: an "AI-generate description" button invokes the JD Generation Agent to draft the description from a short plain-language brief — the draft opens in an editable JD Draft Editor (see [06-agentic-ai-chat-and-disclaimer.md](06-agentic-ai-chat-and-disclaimer.md)); review/edit is required before publish, the description is never auto-published.
- Job posting states the UI must represent: **Draft** (not visible to Job Seekers) → **Active** (visible, accepting applications) → **Closed** (manually closed by recruiter) → **Expired** (auto-closed after a fixed 30-day period if not manually closed first).
- Recruiter can edit an Active posting; edits do not retroactively affect already-submitted applications — no special UI warning is needed beyond standard save confirmation.

## 2. Screening Question Builder

See [04-dynamic-screening-form.md](04-dynamic-screening-form.md) for the full shared-renderer contract. Summary of recruiter-facing UI:

- Screening Question Builder panel alongside the job detail fields.
- 6 supported field types (text, single-select, multi-select, file upload, yes/no, numeric), each markable Mandatory/Optional.
- Preset question library (one-click add) alongside custom question creation.
- "Preview as Job Seeker" button opens the exact seeker-side rendering in a modal before publishing.

## 3. Applicant Management

- Recruiter views a list of applicants per job posting: submitted answers, resume link, profile summary.
- Applicant status pipeline shown in the UI: **Applied → Shortlisted → Interview → Rejected / Hired**, changed manually by the recruiter via a status dropdown/kanban drag. A **"Withdrawn"** status can also appear (set only by the Job Seeker, never by the recruiter) — must remain visible in the list, not filtered out.
- Toggle between **table view** and **kanban view** (columns = pipeline stages, plus a Withdrawn filter/tag).
- Row/card click opens an applicant detail view (answers, resume link, profile summary) with the status-change control.
- Optional AI assist: the Candidate Screening Agent suggestion panel appears as a non-mutating sidebar/banner ("AI suggests: rank #1 — strong match") with the AI disclaimer attached — it is a suggestion only; the recruiter makes the actual status change via the normal UI control.

## 4. Ownership & Access (Frontend Scoping Display)

- One Recruiter account maps to one company profile and its own job postings — the UI only ever needs to render "my jobs" / "my applicants" since the backend already scopes all recruiter-facing endpoints to the authenticated recruiter. No client-side filtering logic is required beyond consuming the scoped API response as-is.

## 5. Minimal Notifications

- In-app notifications only (no email/SMS) for: new applicant received (Recruiter), application status changed (Job Seeker), company verification approved (Recruiter).
- Bell icon with unread-count badge in the top nav; dropdown/panel listing notifications with type icon, message, timestamp, read/unread state.

## 6. Recruiter Dashboard Overview

- On login, the Recruiter lands on a dashboard home showing four summary cards: count of Active job postings, total applicants across all postings, applicants pending review (Applied status), and verification status (Verified/Unverified/Pending Review badge).
- Quick-link rail: Post New Job, View Applicants (per job), Edit Company Profile.

## Implementation Checklist (Frontend)

- [ ] Build job posting creation/edit form (Title, Description, Requirements, Location, Job Type, Salary Range, Remote/Hybrid/Onsite)
- [ ] Wire "AI-generate description" button to the JD Generation flow with mandatory review/edit before publish
- [ ] Represent job posting states (Draft/Active/Closed/Expired) clearly in the UI, including manual close action
- [ ] Build Screening Question Builder panel (6 field types, Mandatory/Optional toggle, preset library, reorder)
- [ ] Build "Preview as Job Seeker" modal reusing the shared `DynamicFormRenderer`
- [ ] Build Applicant Management with table view and kanban view toggle
- [ ] Build applicant detail view (answers, resume link, profile summary, status-change control)
- [ ] Ensure "Withdrawn" status is visible/filterable but never hidden by default
- [ ] Build Candidate Screening suggestion panel (non-mutating, disclaimer attached, reuses `MatchScoreBadge`/ranking display)
- [ ] Build notification bell + dropdown (unread badge, type icon, message, timestamp)
- [ ] Build Recruiter Dashboard home (4 summary cards + quick-link rail)
- [ ] Build Company Profile edit screen (see also [03-auth-onboarding-profile-management.md](03-auth-onboarding-profile-management.md))

## Integration Points

- `POST /api/jobs`, `PUT /api/jobs/{id}`, `PATCH /api/jobs/{id}/status`, `GET /api/jobs/mine`
- `GET /api/jobs/{id}/applicants`, `PATCH /api/applications/{id}/status`
- `GET /api/dashboard/recruiter`
- `GET /api/notifications`, `PATCH /api/notifications/{id}/read`
- `POST /api/agent/generate-jd`, `POST /api/agent/screen-candidates`

See [14-api-contracts-frontend.md](14-api-contracts-frontend.md) for exact shapes.
