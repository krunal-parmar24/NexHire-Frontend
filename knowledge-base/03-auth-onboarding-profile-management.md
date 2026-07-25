# Auth, Onboarding & Profile Management (Frontend)

**Derived from:** SRS v3.1 §3 (Authentication & User Onboarding)

## 1. Authentication (Frontend Responsibilities)

- Auth is custom JWT (Access + Refresh tokens) issued by the backend. The frontend stores tokens and attaches the access token via an Axios interceptor, refreshing on expiry using the refresh token. **No third-party OAuth SSO and no SMTP-based password reset** exist — do not build UI for either.
- Role selection (Job Seeker vs. Recruiter) happens at registration and is **strictly permanent** — do not build any "change role" UI later.
- A **"Quick Demo Login"** feature must be present on the login UI with buttons for pre-seeded test accounts for both roles (for recruiter/interviewer review convenience).
- Registration form must enforce: email format validation, password strength feedback, and surfacing of duplicate-account errors returned by the backend.
- Registration requires a mandatory Terms & Conditions / Privacy Policy consent checkbox before the submit button is enabled.
- Role selection UI is presented as **two clear selectable cards** ("I'm hiring" vs. "I'm looking for a job") — not a dropdown — since the choice is permanent and irreversible.

## 2. Mandatory Hard-Wall Onboarding

Zero platform access (browsing or dashboard) is allowed until onboarding is completed in a single sitting. The frontend must implement a route guard that blocks all navigation until `onboardingCompleted` is true.

- **Job Seeker Fields (Mandatory):** Full Name, Email, Phone, Current Title, Total Experience (Years), Skills (min. 3 tags), Preferred Job Type, Preferred Location.
- **Job Seeker Fields (Optional):** Certifications, Portfolio/LinkedIn links, Expected Salary Range.
- **Resume Upload Widget:** drag-and-drop, max 1MB, client-side validates size/type before upload; shows an "auto-filling your profile..." loading state while the backend parses (PdfPig/OpenXml extraction + GPT-4.1-mini parse) and returns fields to pre-fill the form. This parse is always **0 AI credit cost** — no credit-related UI (meter deduction, warnings) should trigger for this action.
- **Recruiter Fields:** Company Name, Industry, Size, Designation. New Recruiter accounts show an "Unverified" badge immediately but retain full job-posting access pre-verification.

## 3. Profile Management (Post-Onboarding)

- Once onboarding is complete, both roles can edit their profile at any time from their dashboard — onboarding is a one-time mandatory gate, not a one-time-ever data entry screen.
- Job Seeker can update: resume (re-upload triggers the same free 0-credit AI re-parse), skills, experience, job preferences, and optional fields (certifications, links, photo, summary).
- Recruiter can update: company details, logo, description, designation. The UI should reflect that material changes to company identity (e.g., company name) may reset verification status to "Pending Review" and re-apply the "Unverified" badge until re-approved — show this state change clearly if the backend response indicates it.
- Mandatory fields remain mandatory on edit — apply the same client-side validation rules used during onboarding.

## 4. UI Composition Notes

- **Login/Register Modal:** two-tab (Login/Register), opened in-context, never a full-page redirect. Register tab shows the two role-selection cards. Includes Quick Demo Login buttons (one per role).
- **Onboarding Wizard:** multi-step with a progress indicator (step N of total); cannot be dismissed or skipped (hard-wall). Resume upload step has drag-and-drop + validation feedback + parse loading state.
- **Profile Edit Screens:** reuse the same field components/validation as onboarding, for both Job Seeker and Recruiter.

## Implementation Checklist (Frontend)

- [ ] Build React auth context + Axios interceptor for JWT attach/refresh
- [ ] Build Login/Register modal (two-tab, in-context, non-redirect)
- [ ] Build role-selection card UI ("I'm hiring" / "I'm looking for a job")
- [ ] Add Quick Demo Login buttons (seeker + recruiter) wired to pre-seeded demo accounts
- [ ] Implement registration client-side validation: email format, password strength, mandatory T&C checkbox
- [ ] Implement onboarding hard-wall route guard blocking all navigation until `onboardingCompleted === true`
- [ ] Build Job Seeker onboarding wizard (mandatory + optional fields as specified)
- [ ] Build Recruiter onboarding wizard (Company Name, Industry, Size, Designation)
- [ ] Build resume upload widget (1MB client-side cap check, drag-and-drop, parse-loading state, auto-fill review)
- [ ] Build Recruiter "Unverified"/"Verified"/"Pending Review" badge display logic
- [ ] Build post-onboarding profile editing screens for both roles (same validation rules as onboarding)
- [ ] Ensure resume re-upload on profile edit shows the same free re-parse flow (no credit meter impact)
- [ ] Surface verification-status-reset messaging when a material company-identity change is detected in the API response

## Integration Points

- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`
- `POST /api/onboarding/jobseeker`, `POST /api/onboarding/recruiter`, `POST /api/onboarding/parse-resume`
- `PUT /api/profile/jobseeker`, `PUT /api/profile/recruiter`

See [14-api-contracts-frontend.md](14-api-contracts-frontend.md) for exact request/response shapes.
