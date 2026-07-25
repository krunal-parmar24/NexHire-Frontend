# Dynamic Screening Form (Frontend)

**Derived from:** SRS v3.1 §4 (Dynamic Screening Form Architecture), §7.2 (Screening Question Builder — frontend rendering aspects)

## 1. Why This Matters

Recruiters attach dynamic screening questions to job postings. Question definitions and submitted answers are stored server-side as PostgreSQL `jsonb`. The frontend never needs to know about jsonb as a storage detail — it only needs to consume/produce the JSON **shape** below and render it consistently everywhere it appears.

## 2. Schema Shape (as consumed by the frontend)

**Question definition** (received from `GET /api/jobs/{id}` as `screeningQuestions[]`, and sent from the recruiter builder as part of `POST /api/jobs` / `PUT /api/jobs/{id}`):

```json
{
  "id": "q1_experience",
  "label": "Years of experience with ASP.NET Core?",
  "type": "numeric",
  "required": true
}
```

**Candidate answer** (sent as part of `POST /api/applications`):

```json
{ "questionId": "q1_experience", "value": "4" }
```

## 3. Supported Field Types (must match recruiter-side builder exactly)

`text | single-select | multi-select | file upload | yes/no | numeric`

Model these as a discriminated union in TypeScript (see [10-coding-standards-frontend.md](10-coding-standards-frontend.md)) so the renderer's type-switch is exhaustively checked. Each question is marked Mandatory or Optional and must render an asterisk when required.

## 4. The Shared `DynamicFormRenderer` Component

- **This must be a single shared component** consumed by three different contexts:
  1. The recruiter's Screening Question Builder (edit mode — define questions).
  2. The recruiter's "Preview as Job Seeker" modal (read-only preview — exact seeker-side rendering).
  3. The Job Seeker's live Application Form (fill mode — submit answers).
- Never fork this component into role-specific copies. All three contexts must render **identically** for the same schema — this is a hard acceptance criterion (a Day 4 DoD item and a Day 14 regression item).
- The component consumes the same jsonb-derived schema shape regardless of caller.

## 5. Recruiter-Side Builder Aspects (Frontend)

- Add/reorder questions, choose field type via a type selector, mark Mandatory/Optional.
- A small **preset question library** (e.g., "Years of relevant experience," "Work authorization status," "Notice period") must be addable with one click, alongside fully custom questions.
- A "Preview as Job Seeker" button must open the exact seeker-side rendering in a modal before publishing.

## 6. Job Seeker-Side Application Form

- Renders the shared component in fill mode, bound to `screeningQuestions`.
- Includes an "Autofill with AI" button above the form — see [06-agentic-ai-chat-and-disclaimer.md](06-agentic-ai-chat-and-disclaimer.md) for the autofill review flow this triggers.
- On submit, answers are posted as `answers[]` mapped to `questionId`.

## Implementation Checklist (Frontend)

- [ ] Define a shared TypeScript discriminated union type for the 6 screening-question field types (mirrors backend DTO exactly)
- [ ] Build the single shared `DynamicFormRenderer` component (builder / preview / seeker-fill modes)
- [ ] Implement recruiter builder mode: add/reorder/edit questions, type selector, Mandatory/Optional toggle
- [ ] Implement one-click preset question library alongside custom question creation
- [ ] Implement "Preview as Job Seeker" modal reusing the same renderer in read-only fill mode
- [ ] Implement seeker-fill mode bound to a job's `screeningQuestions`, posting `answers[]` on submit
- [ ] Mark required questions with an asterisk in all three render modes
- [ ] Verify pixel/behavioral parity between preview mode and the live seeker form for all 6 field types

## Integration Points

- `GET /api/jobs/{id}` → `screeningQuestions[]`
- `POST /api/jobs`, `PUT /api/jobs/{id}` (Recruiter) → same shape, editable
- `POST /api/applications` → `answers[]`

See [14-api-contracts-frontend.md](14-api-contracts-frontend.md) for full request/response examples.
