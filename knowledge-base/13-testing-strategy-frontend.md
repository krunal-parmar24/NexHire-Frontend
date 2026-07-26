# Manual Testing Strategy (Frontend)

**Derived from:** Manual Testing Strategy §1 (Testing Approach), §3 (Manual Test Case Checklist — frontend-testable items, by Day), §5 (Final Regression Checklist — frontend phrasing)

## 1. Testing Approach

- **No automated test suite is in scope** — manual testing during the build/polish phase is explicitly sufficient.
- Manual testing happens **daily**, at the end of each Implementation Plan day, against that day's frontend-relevant Testing/DoD items below — not deferred to the end of the sprint.
- A final full regression pass occurs on Day 14 against the frontend-relevant rows of the Acceptance Criteria table (§3 below).

## 2. Frontend-Testable Checklist (By Day)

Each item below is UI-observable — states, forms, flows a person can click through in the browser (as opposed to Postman/API-level checks, which live in the Backend knowledge base).

### Day 1 — Auth Foundations

- [ ] Register a new Job Seeker account via the UI; confirm role is permanently set (no way to change it afterward in the UI)
- [ ] Register a new Recruiter account via the UI; confirm role is permanently set
- [ ] Log in with valid credentials; confirm the frontend stores and attaches the JWT on subsequent requests

### Day 2 — Onboarding & Resume Parsing

- [ ] New user is blocked from all navigation until onboarding is submitted
- [ ] Upload a sample PDF resume under 1MB; confirm ≥5 profile fields auto-fill correctly in the wizard
- [ ] Upload a sample DOCX resume under 1MB; confirm extraction works and fields populate
- [ ] Attempt an upload over 1MB; confirm the UI rejects it client-side with a clear message
- [ ] Confirm the credit meter does not change after a resume parse (0-credit rule)

### Day 3 — Guest Browsing & Search

- [ ] Guest (no auth) can view job listings and job detail pages
- [ ] Keyword, location, job type, and remote/hybrid/onsite filters all work in the UI
- [ ] Clicking Apply/Save/Message as a guest opens the login modal, preserving job context

### Day 4 — Recruiter Job Posting & Screening Builder

- [ ] Recruiter creates a job posting with all required fields via the UI
- [ ] Job posting builder supports all 6 screening-question field types
- [ ] Preview mode matches the seeker-side renderer exactly (visual + behavioral parity)
- [ ] Job posting state transitions (Draft→Active→Closed/Expired) are reflected correctly in the UI

### Day 5 — Dynamic Application Form & Submission Rules

- [ ] Job Seeker completes and submits a dynamic application form via the UI
- [ ] Duplicate application attempt shows the specific "already applied" message, not a generic error
- [ ] Withdraw action is shown/works before Hired/Rejected; hidden/blocked after
- [ ] Withdrawn application remains visible to the recruiter in the Applicant Management UI (not hidden)

### Day 6 — Applicant Management & Recruiter Dashboard

- [ ] Recruiter views applicant list with answers, resume link, and profile summary rendered correctly
- [ ] Status transitions (Applied→Shortlisted→Interview→Rejected/Hired) work via the UI and persist on refresh
- [ ] Recruiter dashboard counts (active postings, total applicants, pending review) match backend truth
- [ ] Recruiter UI only ever shows applicants for jobs they personally posted

### Day 7 — ATS Match Scoring Engine (Display)

- [ ] Match Score badge renders the correct overall percentage and pillar breakdown tooltip
- [ ] Badge correctly reflects `certificationWeightRedistributed` cases in its breakdown
- [ ] Match Score badge is hidden for guest users

### Day 8 — Agent Framework, Chat Shell & First 2 Tools

- [ ] Chat prompt "find me jobs matching my profile" returns a ranked result list with a streamed reasoning trace visible in the UI
- [ ] A single in-flight request is enforced — sending a second message while one is processing is blocked in the UI (input disabled)
- [ ] Rate limit condition triggers the "AI Busy" UI message without changing the credit meter
- [ ] Failed AI calls show an inline error without changing the credit meter

### Day 9 — Autofill Loop, Bulk Apply, JD Generation (UI)

- [ ] Autofill on a job with an unmapped required question triggers the Interactive Pause-and-Prompt UI
- [ ] All pre-filled/prompted answers are editable in the Review Card before submission
- [ ] "Save to profile" toggle correctly reflects the intent to persist an edited value
- [ ] No application submits without an explicit "Confirm & Submit Application" click
- [ ] Bulk Apply UI only lists jobs with ATS score ≥ 80%
- [ ] Bulk Apply requires a single batch confirmation click before submitting
- [ ] JD Generation output requires manual edit/review in the UI before the "Publish" action is enabled

### Day 10 — Status Tool, Candidate Screening, Notifications (UI)

- [ ] Chat query "what's my application status" returns a correct, live pipeline stage in the chat UI
- [ ] Candidate Screening suggestion panel never auto-changes an applicant's status
- [ ] Notification UI fires/updates for: new applicant received, application status changed, verification approved
- [ ] All 6 agent tools are invokable from the chat UI with the correct credit cost shown

### Day 11 — AI Disclaimer, Admin Verification, Profile Editing (UI)

- [ ] AI disclaimer is visible on every AI output surface (chat footer, autofill review, JD draft, match explanations) without exception
- [ ] Resume re-upload on profile edit triggers the same free re-parse UI flow (0-credit)
- [ ] Changing a company's name in the UI reflects a reset to "Pending Review"/"Unverified" badge state after save
- [ ] Admin mini-panel can approve/reject a recruiter's verification request

### Day 12 — Hardening (Frontend UI States)

- [ ] Zero AI credit balance shows the "Coming Soon" upgrade prompt; manual search/apply flows remain fully usable
- [ ] Platform rate-limit exhaustion shows "AI Busy" without any credit-meter change
- [ ] No unhandled exception/blank screen appears anywhere in a full manual walkthrough of guest, seeker, recruiter, and AI flows
- [ ] Edge cases pass in the UI: duplicate apply message, expired job listing display, withdrawn application visibility
- [ ] Confirm no secrets appear in the browser console, network tab, or bundled JS

### Day 13 — Deployment & E2E Integration

- [ ] Full guest→apply→login→onboarding→AI autofill→submit journey works on the production Render URL
- [ ] Full recruiter post→screen(AI)→manage→hire journey works on the production Render URL
- [ ] Quick Demo Login works for both roles in production
- [ ] SEO meta tags render correctly on production job listing pages (view source / crawler check)
- [ ] No console errors during the full walkthrough

### Day 14 — Final Polish & Demo Readiness

- [ ] Full regression pass against every frontend-relevant row in Section 3 below
- [ ] Demo script covering all 6 tools + HITL confirmations + disclaimer visibility runs without failure in the UI

## 3. Final Regression Checklist (Frontend Phrasing)

- [ ] Guest Browsing — unauthenticated browse/filter renders correctly with SEO meta tags present
- [ ] Auth & Onboarding — client-side validations work, role selection is permanent in the UI, hard-wall gate blocks navigation, ≥5 fields auto-fill on resume upload at 0 credit cost
- [ ] Apply Gate — modal opens (no redirect), post-login returns to the same job's form, recruiter sees blocking toast, duplicate-apply message is specific
- [ ] Withdraw — allowed pre-decision in the UI, shows as "Withdrawn" to the recruiter (not hidden)
- [ ] Dynamic Screening Forms — identical rendering across preview and live seeker form for all 6 field types
- [ ] ATS Scoring Display — badge/breakdown renders correctly including no-cert redistribution cases
- [ ] Job Posting Lifecycle — Draft→Active→Closed/Expired states render correctly; edits to Active postings don't visually alter already-submitted applications
- [ ] Applicant Management — recruiter UI scoping correct, status pipeline UI works, status change visible to seeker
- [ ] Orchestrator & Tools (UI) — all 6 tools' results render correctly with credit costs shown, streamed traces visible, single in-flight enforced
- [ ] Autofill Loop (UI) — prompt on unmapped required fields, editable pre-submit, save-to-profile toggle works, submit locked until explicit confirm
- [ ] Bulk Apply (UI) — only ATS≥80% jobs listed, single batch confirmation
- [ ] Credits & Rate Limits (UI) — meter reflects balance correctly, zero-balance blocks AI only, "AI Busy" shown without deduction, failed calls never affect the meter
- [ ] AI Disclaimer — persistent on chat footer and inline on all AI-drafted content
- [ ] Notifications (UI) — new applicant, status change, verification approved all appear in-session
- [ ] Security (Frontend) — no JWT secret or LLM API key ever visible in bundle, console, or network responses
- [ ] Deployment — public Render URL live, Quick Demo Login works for both roles, no console errors in full E2E walkthrough

## Implementation Checklist

- [ ] Run the Day-N frontend checklist (Section 2) at the end of each of the 14 build days before proceeding
- [ ] Log any failing case using the severity convention defined in the Backend knowledge base's testing strategy file (shared convention)
- [ ] Run the full Section 3 regression checklist on Day 14 before considering the frontend demo-ready
