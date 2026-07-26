# UI/UX Design Reference

**Derived from:** UI/UX Design Reference (full document — Frontend-only, no backend relevance)

## 1. Design Intent

The UI must visibly showcase the Agentic AI differentiators that are the project's purpose — tool-calling, human-in-the-loop governance, streaming reasoning traces, and interactive validation loops — to recruiters and interviewers. Visual design should prioritize **clarity of AI reasoning and confirmation steps** over decorative polish; this is a functional/demo priority, not a branding exercise.

## 2. Theme & Design Tokens

`[CONVENTION — no brand/theme guidance exists in source docs; using PrimeReact's theming system as already mandated]`

- **Component library:** PrimeReact, using its built-in theme system rather than custom-built components. Choose one PrimeReact theme (e.g., `lara-light-blue` or `lara-dark-blue`) as the base and do not fork it into a fully custom design system — time is better spent on the Agentic AI features.
- **Color roles** (map to PrimeReact theme variables, do not hardcode hex values in components):
  - Primary — brand/action color (buttons, links, active nav)
  - Success — Hired, Verified, Active job status
  - Warning — Pending Review, Unverified, "AI Busy"
  - Danger — Rejected, Expired, Withdrawn, validation errors
  - Info — AI-generated content banners, disclaimer text
- **Typography:** System font stack (no custom font loading required); one heading scale (H1–H4) and one body size, consistent across seeker and recruiter views.
- **Spacing:** 8px base unit grid (8/16/24/32px) for padding/margins — standard PrimeReact/PrimeFlex convention.
- **Iconography:** PrimeIcons library exclusively.

## 3. Layout Patterns

- **Public/Guest layout:** Top nav (logo, search, Login/Register CTA) + content + footer. No sidebar. Optimized for SEO crawlability.
- **Authenticated Job Seeker layout:** Top nav (logo, nav links, credit meter, notification bell, avatar) + main content area. Persistent chat icon fixed bottom-right on every page.
- **Authenticated Recruiter layout:** Same top nav pattern as Job Seeker, plus a left-side quick-link rail on dashboard-adjacent pages (Post Job, View Applicants, Edit Company).
- **Chat page layout:** Full-page (not a drawer/panel) — message history area, streaming reasoning trace region, input box, and persistent disclaimer footer.

## 4. Screen-by-Screen Reference

### 4.1 Job Listing Page (Guest)

- Filter sidebar (keyword, location, job type, remote/hybrid/onsite) on the left; job card grid on the right.
- Each job card: title, company, location, job type tag, remote-type tag, "Apply"/"Save" buttons (visible but gated).

### 4.2 Job Detail Page

- Header: title, company logo, location, job type/remote tags, Match Score badge (authenticated Job Seeker only; hidden for guests).
- Body: description, requirements.
- Sticky action bar: Apply / Save / Message Recruiter (gated behind login modal for guests).

### 4.3 Login/Register Modal

- Two-tab modal (Login / Register), opened in-context over the current page — never a full-page redirect.
- Register tab: role-selection as two large selectable cards ("I'm hiring" / "I'm looking for a job"), not a dropdown.
- Includes Quick Demo Login buttons (one per role) for reviewer convenience.

### 4.4 Onboarding Wizard

- Multi-step wizard with a progress indicator (step 1 of N); cannot be dismissed or skipped (hard-wall).
- Resume upload step includes a drag-and-drop zone with file-size/type validation feedback and an "auto-filling your profile..." loading state during parse.

### 4.5 Job Seeker Dashboard / My Applications

- Table/list of applications: job title, company, status tag (color-coded), submitted date, withdraw action (only shown pre-final-decision).

### 4.6 Dynamic Application Form

- Rendered by the shared `DynamicFormRenderer`; one field type per screening question (text/select/multi-select/file/yes-no/numeric), required fields marked with an asterisk.
- "Autofill with AI" button above the form, opening the Review Card flow.

### 4.7 Review Card (Autofill)

- Card-per-question layout; each field shows the pre-filled value with an inline edit icon; modified fields show a "Save to profile" toggle.
- Persistent AI disclaimer directly below the card, above the "Confirm & Submit Application" button (disabled until reviewed).

### 4.8 Recruiter Dashboard Home

- Four summary cards: Active Postings, Total Applicants, Pending Review, Verification Badge.
- Quick-link rail: Post New Job, View Applicants (per job), Edit Company Profile.

### 4.9 Job Posting Wizard + Screening Question Builder

- Left panel: job detail fields (Title, Description, Requirements, Location, Job Type, Salary Range, Remote Type) with an "AI-generate description" button opening the JD Draft Editor.
- Right panel: screening question builder — add/reorder questions, choose field type via a type selector, mark Mandatory/Optional, one-click preset library.
- "Preview as Job Seeker" button opens the exact seeker-side rendering in a modal.

### 4.10 Applicant Management (Table/Kanban)

- Toggle between table view and kanban view (columns = pipeline stages: Applied/Shortlisted/Interview/Rejected/Hired, plus a Withdrawn filter/tag).
- Row/card click opens applicant detail (answers, resume link, profile summary) with a status-change dropdown.
- Candidate Screening suggestion panel appears as a non-mutating sidebar/banner ("AI suggests: rank #1 — strong match") with the AI disclaimer attached.

### 4.11 Chat Page

- Full-page layout; message bubbles for user turns, a distinct "reasoning trace" visual style (e.g., collapsible/streaming monospace-adjacent block) for agent thinking steps, then a final structured result (job cards, draft answers, etc.) rendered inline.
- Input box disabled while a request is in-flight, with a subtle loading indicator communicating the single-in-flight-request rule.
- Persistent disclaimer footer, always visible.

### 4.12 Bulk Apply Review Screen

- List of eligible jobs (ATS ≥ 80%) with score badges; single "Confirm Bulk Apply (N jobs)" button at the bottom — no per-job confirmation.

### 4.13 Credit Meter & Upgrade Prompt

- Small persistent widget (e.g., in top nav): "350 / 500 credits" with a progress bar; color shifts toward Warning as balance approaches zero.
- On a blocked AI action: a modal/toast with "Coming Soon" upgrade messaging, not a dead-end error.

### 4.14 Notification Center

- Bell icon with unread-count badge in top nav; dropdown/panel listing notifications with type icon, message, timestamp, read/unread state.

## 5. Shared Component States

Every data-driven component (job list, applicant list, notifications, chat) must define:

- **Loading state** — skeleton placeholders, not blank screens or spinners-only.
- **Empty state** — clear message + relevant call-to-action (e.g., "No applications yet — browse jobs" for Job Seeker; "No applicants yet" for Recruiter).
- **Error state** — inline error message ("Something went wrong... please try again"), with a retry action where applicable — never a blank or crashed screen.
- **AI-blocked state** — distinct from a generic error: shows the "Coming Soon" upgrade prompt (zero credit) or "AI Busy" toast (platform rate limit).

## 6. Accessibility Baseline

- All interactive elements reachable via keyboard (Tab/Enter), leveraging PrimeReact's built-in accessibility support rather than custom-building it.
- Sufficient color contrast for status tags (do not rely on color alone — pair with text labels, e.g., "Hired" text plus a green tag, not just a green dot).
- Form fields have associated labels (not placeholder-only), especially important for the dynamic screening form where field types vary.
- Deep mobile-responsive polish is explicitly out of scope — basic usability (no horizontal scroll/broken layout) is the only bar, not full responsive optimization.

## Implementation Checklist

- [ ] Select and apply one PrimeReact theme; do not fork into a fully custom design system
- [ ] Define color-role mapping (Primary/Success/Warning/Danger/Info) to theme variables
- [ ] Build shared Loading/Empty/Error/AI-blocked states as reusable components
- [ ] Implement the two-tab Login/Register modal with card-based role selection
- [ ] Implement the onboarding wizard with a non-dismissible progress indicator
- [ ] Implement the Review Card with inline edit + save-to-profile toggle + disclaimer placement
- [ ] Implement Applicant Management with both table and kanban view toggle
- [ ] Implement the chat page's distinct "reasoning trace" visual treatment separate from final results
- [ ] Implement the credit meter widget with color-shift-on-low-balance behavior
- [ ] Verify all status tags use text + color (not color-only) for accessibility
- [ ] Verify basic mobile usability (no broken layout) without pursuing deep responsive polish
