# Guest Browsing & Application Gate (Frontend)

**Derived from:** SRS v3.1 §2 (Guest User Job Discovery & Application Gate)

## 1. Guest Browsing & Manual Search

- Unauthenticated (guest) users can view all active/published job postings: title, company, location, description, requirements.
- Manual (non-AI) search and filter — keyword search plus filters for location, job type (Full-time/Part-time/Contract), and Remote/Hybrid/Onsite — is available to guests and logged-in users alike, independent of the AI chatbot.
- Restricted actions (Apply, Save Job, Message Recruiter) remain **visible** to guests but are gated behind login — do not hide these buttons, disable/gate them.
- Job listing pages must be crawlable/indexable for SEO even in guest mode (server-renderable meta tags, semantic HTML, no client-only rendering of critical content).

## 2. Apply Action — Authentication Gate

- Clicking "Apply" opens a **Login/Register modal** (not a full-page redirect) to preserve context.
- After successful login, the user returns to the **same job's application flow**, not the homepage (intent preservation).
- Apply remains visible to all guests regardless of eventual role; role is not known until after authentication.
- If a guest closes the modal mid-flow without completing login/register, the job context is **not** preserved — the user is returned to the job listing page. No draft/resume-later state is maintained for this interruption.

## 3. Role-Based Routing Post-Login

- Job Seeker → proceeds directly to the job's dynamic application form.
- Recruiter → redirected to the Recruiter Dashboard with a toast/banner explaining that recruiter accounts cannot apply to jobs.
- For an already-logged-in user clicking Apply, the Login/Register modal is **skipped entirely** and the click goes straight into role-based routing.

## 4. Application Submission Rules (UI Behavior)

- The UI must reflect duplicate-application prevention — if the backend returns `409 DUPLICATE_APPLICATION`, show that specific message rather than a generic error (see [14-api-contracts-frontend.md](14-api-contracts-frontend.md)).
- A Job Seeker can withdraw a submitted application at any time before a final decision (Rejected/Hired). Withdrawing sets status to "Withdrawn" — the withdraw action must only be shown pre-final-decision, and a `409 WITHDRAWAL_NOT_ALLOWED` response should surface a clear inline message if attempted after.
- "Withdrawn" applications remain visible in the recruiter's Applicant Management view (frontend must not filter them out by default).

## 3. UI Composition Notes (see also 15-ui-ux-design-reference.md)

- **Job Listing Page:** Filter sidebar (keyword, location, job type, remote/hybrid/onsite) + job card grid. Each card: title, company, location, job type tag, remote-type tag, Apply/Save buttons (visible but gated).
- **Job Detail Page:** Header (title, company logo, location, tags, Match Score badge for authenticated Job Seekers only — hidden for guests), body (description/requirements), sticky action bar (Apply/Save/Message Recruiter).

## Implementation Checklist (Frontend)

- [ ] Build public job listing page (guest-accessible, SEO-crawlable, keyword + location + job type + remote/hybrid/onsite filters)
- [ ] Build job detail page with gated Apply/Save/Message actions visible to guests
- [ ] Implement Login/Register modal (in-context, no full-page redirect)
- [ ] Implement post-login intent restoration back to the originating job's application flow
- [ ] Implement fallback to job listing page (no draft state) if modal closed mid-flow
- [ ] Implement role-based post-login routing (Job Seeker → application form; Recruiter → dashboard + toast/banner)
- [ ] Skip the login modal entirely for already-authenticated users; route directly by role
- [ ] Handle `DUPLICATE_APPLICATION` (409) with a specific inline message on the application form
- [ ] Show withdraw action only when application status is pre-final-decision; handle `WITHDRAWAL_NOT_ALLOWED` (409) gracefully
- [ ] Ensure "Withdrawn" applications remain visible (not hidden/filtered) in the recruiter's Applicant Management view

## Integration Points

- `GET /api/jobs`, `GET /api/jobs/{id}` — guest-accessible, no auth header required.
- `POST /api/auth/login`, `POST /api/auth/register` — invoked from the modal.
- `POST /api/applications`, `PATCH /api/applications/{id}/withdraw` — see [14-api-contracts-frontend.md](14-api-contracts-frontend.md) for exact shapes and error codes.
