# API Contracts — Frontend Consumer Reference

**Derived from:** API Contracts Reference (full document, reframed as "what to call and what shape to expect")

> This is the same contract the backend implements as its source of truth (see Backend KB's `15-api-contracts-backend.md`), reframed here for consumption: what to call, what to send, what shape comes back, and which errors to handle. No server-side implementation notes are included.

## 1. Conventions

- All request/response bodies are JSON; `Content-Type: application/json`.
- All protected endpoints require `Authorization: Bearer <accessToken>`.
- Dates are ISO 8601 UTC strings (e.g., `2026-07-24T21:00:00Z`).
- IDs are GUID strings.
- Pagination uses `page` and `pageSize` query params; list responses return `{ "items": [...], "totalCount": number, "page": number, "pageSize": number }`.

## 2. Error Envelope — Handle This Shape Everywhere

```json
{
  "error": {
    "code": "DUPLICATE_APPLICATION",
    "message": "You have already applied to this job.",
    "details": null
  }
}
```

| HTTP Status | Meaning                                | Frontend Handling                                                          |
| ----------- | -------------------------------------- | -------------------------------------------------------------------------- |
| 400         | Validation error                       | Show field-level or form-level error from `message`                        |
| 401         | Missing/invalid/expired JWT            | Attempt refresh; if refresh fails, redirect to login                       |
| 403         | Role/ownership check failed            | Show an access-denied state; do not retry                                  |
| 404         | Resource not found                     | Show a not-found empty state                                               |
| 409         | Conflict (duplicate application/email) | Show the specific `code`-driven message inline                             |
| 429         | AI rate limit or credit exhaustion     | Route to the `AI_BUSY` or `CREDIT_EXHAUSTED` UI state, not a generic error |
| 500         | Unhandled server error                 | Show a generic inline error with a retry action                            |

**AI-specific error codes to branch on:** `AI_BUSY` (show "AI Busy — Please try again shortly", no credit meter change), `CREDIT_EXHAUSTED` (show the "Coming Soon" upgrade prompt), `AI_GENERATION_FAILED` (show "Something went wrong generating this — please try again", no credit meter change).

## 3. Auth & Onboarding

### `POST /api/auth/register`

```json
// Send
{ "email": "jane@example.com", "password": "SecurePass123!", "role": "JobSeeker", "acceptedTerms": true }
// Expect (201)
{ "userId": "b3f1...", "role": "JobSeeker", "onboardingCompleted": false }
```

### `POST /api/auth/login`

```json
// Send
{ "email": "jane@example.com", "password": "SecurePass123!" }
// Expect (200)
{ "accessToken": "eyJ...", "refreshToken": "eyJ...", "role": "JobSeeker", "onboardingCompleted": false }
```

### `POST /api/auth/refresh`

```json
// Send: { "refreshToken": "eyJ..." }
// Expect (200): { "accessToken": "eyJ...", "refreshToken": "eyJ..." }
```

### `POST /api/onboarding/jobseeker`

```json
// Send
{
  "fullName": "Jane Doe",
  "phone": "+91-9999999999",
  "currentTitle": "Backend Engineer",
  "totalExperienceYears": 5,
  "skills": ["C#", "ASP.NET Core", "SQL"],
  "preferredJobType": "Full-time",
  "preferredLocation": "Remote",
  "certifications": [],
  "portfolioLinks": [],
  "expectedSalaryRange": null
}
// Expect (200): { "onboardingCompleted": true }
```

### `POST /api/onboarding/recruiter`

```json
// Send: { "companyName": "Acme Corp", "industry": "Software", "size": "51-200", "designation": "HR Manager" }
// Expect (200): { "onboardingCompleted": true, "verificationStatus": "Unverified" }
```

### `POST /api/onboarding/parse-resume`

```json
// Send: multipart/form-data, field "file" (max 1MB, PDF/DOCX)
// Expect (200) — 0 credit cost
{
  "parsedFields": {
    "fullName": "Jane Doe",
    "currentTitle": "Backend Engineer",
    "totalExperienceYears": 5,
    "skills": ["C#", "ASP.NET Core"]
  },
  "creditsDeducted": 0
}
```

### `PUT /api/profile/jobseeker` / `PUT /api/profile/recruiter`

Same field shapes as the corresponding onboarding endpoint; used for post-onboarding edits.

## 4. Jobs & Applications

### `GET /api/jobs`

```
Query: ?keyword=&location=&jobType=&remoteType=&page=1&pageSize=20
```

```json
// Expect (200)
{
  "items": [
    {
      "id": "j1...",
      "title": "Backend Engineer",
      "companyName": "Acme Corp",
      "location": "Remote",
      "jobType": "Full-time",
      "remoteType": "Remote",
      "status": "Active",
      "createdAt": "2026-07-20T10:00:00Z"
    }
  ],
  "totalCount": 42,
  "page": 1,
  "pageSize": 20
}
```

No auth header required — guest-accessible.

### `GET /api/jobs/{id}`

```json
// Expect (200)
{
  "id": "j1...",
  "title": "Backend Engineer",
  "description": "...",
  "requirements": "...",
  "location": "Remote",
  "jobType": "Full-time",
  "salaryRange": "10-15 LPA",
  "remoteType": "Remote",
  "status": "Active",
  "screeningQuestions": [
    {
      "id": "q1_experience",
      "label": "Years of experience with ASP.NET Core?",
      "type": "numeric",
      "required": true
    }
  ]
}
```

No auth header required — guest-accessible.

### `GET /api/jobs/saved` (Job Seeker, auth required)

```json
// Expect (200) — returns list of job IDs the authenticated user has saved
["j1...", "j2..."]
```

### `POST /api/jobs/{id}/save` (Job Seeker, auth required)

```json
// Send: {}
// Expect (200) — toggles the saved state
{ "isSaved": true }
```

### `POST /api/jobs` (Recruiter, auth required)

```json
// Send
{
  "title": "Backend Engineer",
  "description": "...",
  "requirements": "...",
  "location": "Remote",
  "jobType": "Full-time",
  "salaryRange": "10-15 LPA",
  "remoteType": "Remote",
  "screeningQuestions": [
    {
      "id": "q1_experience",
      "label": "Years of experience with ASP.NET Core?",
      "type": "numeric",
      "required": true
    }
  ]
}
// Expect (201): { "id": "j1...", "status": "Draft" }
```

### `PUT /api/jobs/{id}` (Recruiter) — same shape as `POST /api/jobs`.

### `PATCH /api/jobs/{id}/status` (Recruiter)

```json
// Send: { "status": "Active" }   // Draft | Active | Closed | Expired
```

### `GET /api/jobs/mine` (Recruiter) — same list shape as `GET /api/jobs`, scoped to the recruiter's own postings.

### `POST /api/applications`

```json
// Send
{
  "jobId": "j1...",
  "answers": [{ "questionId": "q1_experience", "value": "4" }]
}
// Expect (201): { "applicationId": "a1...", "status": "Applied" }
// Expect (409) on duplicate: { "error": { "code": "DUPLICATE_APPLICATION", "message": "You have already applied to this job." } }
```

### `GET /api/applications/mine` — list of the current Job Seeker's applications.

### `PATCH /api/applications/{id}/withdraw`

```json
// Expect (200): { "status": "Withdrawn" }
// Expect (409) after final decision: { "error": { "code": "WITHDRAWAL_NOT_ALLOWED", "message": "Cannot withdraw after a final decision." } }
```

### `GET /api/jobs/{id}/applicants` (Recruiter)

```json
// Expect (200)
{
  "items": [
    {
      "applicationId": "a1...",
      "applicantName": "Jane Doe",
      "status": "Applied",
      "answers": [{ "questionId": "q1_experience", "value": "4" }],
      "resumeUrl": "https://.../resume.pdf",
      "profileSummary": "5 yrs backend engineer..."
    }
  ]
}
```

### `PATCH /api/applications/{id}/status` (Recruiter)

```json
// Send: { "status": "Shortlisted" }   // Applied|Shortlisted|Interview|Rejected|Hired
```

### `GET /api/dashboard/recruiter`

```json
// Expect (200): { "activeJobPostings": 5, "totalApplicants": 34, "pendingReview": 12, "verificationStatus": "Verified" }
```

## 5. ATS Match Score

### `GET /api/jobs/{id}/match-score`

```json
// Expect (200)
{
  "jobId": "j1...",
  "overallScore": 78,
  "breakdown": {
    "skillsCoverage": { "weight": 40, "score": 85 },
    "experienceFit": { "weight": 25, "score": 90 },
    "certificationMatch": { "weight": 20, "score": 0 },
    "domainTitleMatch": { "weight": 15, "score": 70 }
  },
  "certificationWeightRedistributed": false
}
```

## 6. Agent / AI Endpoints

### Chat (SignalR-primary; `POST /api/agent/chat` is the HTTP-invocation shape)

```json
// Send: { "conversationId": "c1...", "message": "find me jobs matching my profile" }
```

```json
// Streamed chunks via SignalR
{ "type": "reasoning", "content": "Searching job listings using your profile skills..." }
{ "type": "tool_call", "toolName": "JobSearchMatchTool", "creditsDeducted": 5 }
{ "type": "final", "content": "Here are 3 matching jobs...", "data": [ /* job + score list */ ] }
```

### `POST /api/agent/autofill`

```json
// Send: { "applicationDraftId": "d1...", "jobId": "j1..." }
// Expect (200)
{
  "phase": "ReviewAndInlineEdit",
  "draftAnswers": [
    {
      "questionId": "q1_experience",
      "value": "4",
      "source": "AutoResolved",
      "editable": true
    }
  ],
  "unresolvedRequiredQuestions": [],
  "creditsDeducted": 10
}
```

### `POST /api/agent/bulk-apply`

```json
// Send: { "minAtsScore": 80 }
// Expect (200): { "eligibleJobs": [ { "jobId": "j2...", "atsScore": 84 } ], "requiresBatchConfirmation": true, "creditsPerApplication": 10 }
```

### `POST /api/agent/generate-jd` (Recruiter)

```json
// Send: { "brief": "Looking for a senior backend engineer with .NET and Azure experience" }
// Expect (200): { "draftDescription": "We are seeking...", "creditsDeducted": 15, "requiresManualReview": true }
```

### `POST /api/agent/screen-candidates` (Recruiter)

```json
// Send: { "jobId": "j1..." }
// Expect (200)
{
  "suggestions": [
    {
      "applicationId": "a1...",
      "rank": 1,
      "summary": "Strong ASP.NET Core match, 5 yrs exp"
    }
  ],
  "creditsDeducted": 5,
  "note": "Suggestion only — no status changes applied"
}
```

## 7. Credits, Notifications & Admin

### `GET /api/credits/balance`

```json
// Expect (200): { "creditBalance": 350, "quota": 500, "resetDate": "2026-08-15T00:00:00Z" }
```

### `GET /api/notifications`

```json
// Expect (200): { "items": [ { "id": "n1...", "type": "ApplicationStatusChanged", "message": "Your application status changed to Shortlisted", "isRead": false, "createdAt": "2026-07-24T18:00:00Z" } ] }
```

### `PATCH /api/notifications/{id}/read`

```json
// Expect (200): { "isRead": true }
```

### `PATCH /api/admin/companies/{id}/verify`

```json
// Send: { "approve": true }
// Expect (200): { "verificationStatus": "Verified" }
```

## Implementation Checklist (Frontend)

- [ ] Centralize error-envelope handling (Section 2) in the Axios response interceptor
- [ ] Branch UI state on `AI_BUSY` / `CREDIT_EXHAUSTED` / `AI_GENERATION_FAILED` distinctly from generic errors
- [ ] Mirror all request/response TypeScript types under `src/types/` exactly matching the shapes above
- [ ] Ensure `screeningQuestions` / `answers` shapes match exactly between `GET /api/jobs/{id}` and `POST /api/applications` payloads
- [ ] Handle `409 DUPLICATE_APPLICATION` and `409 WITHDRAWAL_NOT_ALLOWED` with specific inline messages, not generic error text
