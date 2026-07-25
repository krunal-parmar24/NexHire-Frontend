# Antigravity Workflow Playbooks — Frontend

Step-by-step autonomous playbooks for common frontend development tasks on NexHire. Before running any playbook, read [`frontend/knowledge-base/INDEX.md`](INDEX.md) and open the numbered KB file(s) relevant to your task.

---

## Playbook 1 — Scaffold a New React Page / Route

Use this when adding a page that does not yet exist (e.g., a new recruiter view, a new job-seeker screen).

### Step 1 — Identify the route group

Open [`08-frontend-folder-structure.md`](08-frontend-folder-structure.md). Determine which route group owns the new page:

| Group | File | Who sees it |
|---|---|---|
| `Public` | `routes/PublicRoutes.tsx` | Unauthenticated guests |
| `Auth` | `routes/AuthRoutes.tsx` | Login / register modal |
| `JobSeeker` | `routes/JobSeekerRoutes.tsx` | Authenticated job seekers |
| `Recruiter` | `routes/RecruiterRoutes.tsx` | Authenticated recruiters |

### Step 2 — Check the implementation plan

Open [`09-implementation-plan-frontend-tracks.md`](09-implementation-plan-frontend-tracks.md). Find the Day and task that describes the new page. Note the exact task wording — you will check it `[x]` when done.

### Step 3 — Check the API contracts

Open [`14-api-contracts-frontend.md`](14-api-contracts-frontend.md). Identify every endpoint the new page will call. Note the exact request shapes and response shapes — you will need them in Steps 5 and 6.

### Step 4 — Create the page file

Create `frontend/src/pages/<group>/<PageName>Page.tsx`. Follow the naming convention from [`10-coding-standards-frontend.md`](10-coding-standards-frontend.md): PascalCase for component files.

Starter shape:

```tsx
// frontend/src/pages/<group>/<PageName>Page.tsx
import React from 'react';
// Import only from components/, queries/, context/, store/ — never from other pages/

const <PageName>Page: React.FC = () => {
  return (
    <div>
      {/* page content */}
    </div>
  );
};

export default <PageName>Page;
```

### Step 5 — Wire React Query hooks

For every endpoint the page calls, check whether a hook already exists under `frontend/src/queries/`. If one exists, import it. If not, create a new hook file (see **Playbook 3**) before returning here.

### Step 6 — Register the route

Open the appropriate route file (`routes/<Group>Routes.tsx`) and add a `<Route>` entry. Use React Router's lazy-loading pattern if the project already uses it (check `App.tsx` for the existing convention):

```tsx
import { lazy } from 'react';
const <PageName>Page = lazy(() => import('../pages/<group>/<PageName>Page'));

// Inside the route group:
<Route path="/<path>" element={<PageName>Page />} />
```

### Step 7 — Add navigation entry (if applicable)

If the page appears in a sidebar or nav bar, open the relevant layout/nav component and add the link.

### Step 8 — Verify no secrets are present

Confirm the new file contains no references to `LLM_API_KEY`, `JWT_SIGNING_SECRET`, or any server-side secret. Only `VITE_API_BASE_URL` and `VITE_SIGNALR_HUB_URL` are valid frontend env vars.

### Step 9 — Tick the checklist

Mark the corresponding item `[x]` in [`09-implementation-plan-frontend-tracks.md`](09-implementation-plan-frontend-tracks.md).

---

## Playbook 2 — Build a New Component Against the DynamicFormRenderer Contract

Use this when adding or modifying any component that renders, previews, or submits screening questions. **Never fork `DynamicFormRenderer.tsx` into a role-specific copy.**

### Step 1 — Read the contract

Open [`04-dynamic-screening-form.md`](04-dynamic-screening-form.md). Internalize:
- The question definition shape: `{ id, label, type, required }`
- The answer shape: `{ questionId, value }`
- The 6 field types: `text | single-select | multi-select | file upload | yes/no | numeric`
- The three render modes: **builder** (recruiter defines questions), **preview** (read-only seeker view), **fill** (seeker submits answers)

### Step 2 — Read the TypeScript type

Open `frontend/src/types/screeningQuestion.ts`. Confirm the discriminated union matches the backend DTO exactly. If the file does not exist yet, create it with this shape (do not invent new field names):

```ts
// frontend/src/types/screeningQuestion.ts
export type ScreeningQuestionType =
  | 'text'
  | 'single-select'
  | 'multi-select'
  | 'file upload'
  | 'yes/no'
  | 'numeric';

export interface ScreeningQuestion {
  id: string;
  label: string;
  type: ScreeningQuestionType;
  required: boolean;
  options?: string[]; // required for single-select and multi-select
}

export interface ScreeningAnswer {
  questionId: string;
  value: string;
}
```

### Step 3 — Locate DynamicFormRenderer

Open `frontend/src/components/forms/DynamicFormRenderer.tsx`. Understand its existing props interface and mode discriminator before making any changes. The component must accept a `mode` prop:

```tsx
type DynamicFormRendererProps =
  | { mode: 'builder'; questions: ScreeningQuestion[]; onChange: (questions: ScreeningQuestion[]) => void }
  | { mode: 'preview'; questions: ScreeningQuestion[] }
  | { mode: 'fill';   questions: ScreeningQuestion[]; onSubmit: (answers: ScreeningAnswer[]) => void };
```

### Step 4 — Add or modify the component

If adding a **new field type** to the renderer:
1. Add the new type string to the `ScreeningQuestionType` union in `screeningQuestion.ts`.
2. Add a case to the type-switch inside `DynamicFormRenderer.tsx`.
3. **Alert the backend team** — a new field type is a cross-cutting contract change (see Non-Negotiable Rule 2 in [`../AGENTS.md`](../../AGENTS.md)).

If building a **new component that wraps the renderer** (e.g., `ScreeningFormPreviewModal.tsx`):
- Pass `mode="preview"` and the job's `screeningQuestions` array — do not re-implement rendering logic.
- Place the new component in `frontend/src/components/recruiter/` or the appropriate subdirectory per the folder structure.

### Step 5 — Verify parity across all three modes

Render the form in all three modes against the same question fixture (at least one question of each of the 6 types). The output must be visually and behaviorally identical between `preview` and `fill` modes — this is a Day 4 DoD item and a Day 14 regression item per the implementation plan.

### Step 6 — Verify required-field asterisk

All modes must show an asterisk (`*`) next to the label of any question where `required: true`.

### Step 7 — Tick the checklist

Mark the corresponding item `[x]` in [`09-implementation-plan-frontend-tracks.md`](09-implementation-plan-frontend-tracks.md).

---

## Playbook 3 — Wire a New React Query Hook to an Existing Backend Endpoint

Use this when a page or component needs server state that is not yet fetched by any hook under `frontend/src/queries/`.

### Step 1 — Confirm the endpoint exists

Open [`14-api-contracts-frontend.md`](14-api-contracts-frontend.md). Find the endpoint. Confirm:
- The HTTP method and path.
- The exact request shape (query params, body).
- The exact response shape.
- Any error codes to handle (`AI_BUSY`, `CREDIT_EXHAUSTED`, `AI_GENERATION_FAILED`, `DUPLICATE_APPLICATION`, etc.).

> If the endpoint does not yet exist in the API contracts file, do not invent it. Flag the gap to the user before proceeding.

### Step 2 — Add the endpoint function

Open the appropriate file under `frontend/src/api/endpoints/` (`auth.ts`, `jobs.ts`, `applications.ts`, `agent.ts`, `notifications.ts`). Add a typed function that calls `axiosClient`:

```ts
// Example: frontend/src/api/endpoints/jobs.ts
import axiosClient from '../axiosClient';
import { MatchScoreResponse } from '../../types/matchScore';

export const fetchMatchScore = (jobId: string): Promise<MatchScoreResponse> =>
  axiosClient.get<MatchScoreResponse>(`/api/jobs/${jobId}/match-score`).then(r => r.data);
```

Mirror the response type from the contracts file under `frontend/src/types/` (one interface per response shape).

### Step 3 — Create the query hook file

Create `frontend/src/queries/use<Resource><Action>.ts`. Naming convention: `useJobsQuery`, `useMatchScoreQuery`, `useApplicationsQuery`, `useAgentChatMutation`.

**For a GET (query):**

```ts
// frontend/src/queries/useMatchScoreQuery.ts
import { useQuery } from '@tanstack/react-query';
import { fetchMatchScore } from '../api/endpoints/jobs';

export const useMatchScoreQuery = (jobId: string) =>
  useQuery({
    queryKey: ['matchScore', jobId],
    queryFn: () => fetchMatchScore(jobId),
    enabled: !!jobId,
  });
```

**For a POST / PATCH (mutation):**

```ts
// frontend/src/queries/useWithdrawMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { withdrawApplication } from '../api/endpoints/applications';

export const useWithdrawMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: string) => withdrawApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
  });
};
```

### Step 4 — Handle AI-specific error codes

If the endpoint is under `/api/agent/**`, add explicit branching in the calling component for `AI_BUSY`, `CREDIT_EXHAUSTED`, and `AI_GENERATION_FAILED` — these must surface distinct UI states, not a generic error message (see [`14-api-contracts-frontend.md`](14-api-contracts-frontend.md) §2).

The Axios response interceptor in `axiosClient.ts` handles token refresh on 401. All other error codes are handled per-hook or per-component.

### Step 5 — Use the hook in the page/component

Import the hook into the page. Keep data fetching in the page layer; pass data down to components as props. Components must not call query hooks directly unless they are self-contained widgets (e.g., `CreditMeterWidget`).

### Step 6 — Verify no secrets are present

Confirm the new files contain no references to server-side secrets.

### Step 7 — Tick the checklist

Mark the corresponding item `[x]` in [`09-implementation-plan-frontend-tracks.md`](09-implementation-plan-frontend-tracks.md).
