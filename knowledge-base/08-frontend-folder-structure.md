# Frontend Folder Structure

**Derived from:** Architecture & Folder Structure Guide §3 (Frontend Folder Structure), §4 (Cross-Cutting Conventions)

> This structure operationalizes the architecture decisions already stated in the Implementation Plan (§2.3): React (Vite) + PrimeReact, route-based code splitting into Public/Auth/JobSeeker/Recruiter groups, React Query for server state, Context/Zustand for session state.

## Folder Tree

```
/frontend
├── src/
│   ├── main.tsx
│   ├── App.tsx                               # Route groups: Public, Auth, JobSeeker, Recruiter
│   ├── routes/
│   │   ├── PublicRoutes.tsx                  # Job listing, job detail (guest-accessible, SEO)
│   │   ├── AuthRoutes.tsx                    # Login/Register modal routes
│   │   ├── JobSeekerRoutes.tsx                # Onboarding, applications, chat, profile
│   │   └── RecruiterRoutes.tsx               # Dashboard, job posting, applicants, profile
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── JobListingPage.tsx            # Guest browsing + manual search/filter
│   │   │   └── JobDetailPage.tsx             # Gated Apply/Save/Message buttons
│   │   ├── auth/
│   │   │   └── LoginRegisterModal.tsx        # Non-redirect modal, preserves job intent
│   │   ├── onboarding/
│   │   │   ├── JobSeekerOnboardingWizard.tsx
│   │   │   └── RecruiterOnboardingWizard.tsx
│   │   ├── jobseeker/
│   │   │   ├── MyApplicationsPage.tsx        # List + withdraw action
│   │   │   ├── ApplicationFormPage.tsx       # Dynamic form renderer bound to screening_questions
│   │   │   └── ProfileEditPage.tsx
│   │   ├── recruiter/
│   │   │   ├── RecruiterDashboardPage.tsx    # Active postings, applicants, pending, verification badge
│   │   │   ├── JobPostingWizardPage.tsx      # Create/edit job + JD Generation panel
│   │   │   ├── ScreeningQuestionBuilderPage.tsx
│   │   │   ├── ApplicantManagementPage.tsx   # Table/kanban, status transitions
│   │   │   └── CompanyProfileEditPage.tsx
│   │   └── chat/
│   │       └── ChatPage.tsx                  # Full-page chat route (SignalR streaming)
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── PersistentChatIcon.tsx        # Bottom-right, logged-in only
│   │   │   ├── AiDisclaimerBanner.tsx        # Chat footer + inline near AI-drafted content
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── CreditMeterWidget.tsx
│   │   │   └── UpgradeComingSoonPrompt.tsx   # Zero-credit blocked action
│   │   ├── forms/
│   │   │   └── DynamicFormRenderer.tsx       # Shared: builder, preview, and seeker form (6 field types)
│   │   ├── jobs/
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobFilterSidebar.tsx
│   │   │   └── MatchScoreBadge.tsx           # Pillar breakdown tooltip
│   │   ├── applications/
│   │   │   └── ApplicationStatusTag.tsx      # Applied/Shortlisted/.../Withdrawn
│   │   ├── agent/
│   │   │   ├── ReasoningTraceRenderer.tsx    # Streamed SignalR reasoning
│   │   │   ├── ReviewCard.tsx                # Inline edit + save-to-profile toggle
│   │   │   ├── BulkApplyReviewScreen.tsx     # ATS>=80% batch confirm
│   │   │   ├── JdDraftEditor.tsx             # Mandatory edit-before-publish gate
│   │   │   └── CandidateScreeningSuggestionPanel.tsx # Non-mutating suggestions
│   │   └── recruiter/
│   │       ├── PresetQuestionLibrary.tsx
│   │       └── ScreeningFormPreviewModal.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx                   # Auth/session state
│   ├── store/
│   │   └── sessionStore.ts                   # Zustand: chat in-flight flag, intent-preservation state
│   ├── queries/                              # React Query hooks (server state)
│   │   ├── useJobsQuery.ts
│   │   ├── useApplicationsQuery.ts
│   │   ├── useAgentChatMutation.ts
│   │   ├── useCreditsQuery.ts
│   │   └── useNotificationsQuery.ts
│   ├── api/
│   │   ├── axiosClient.ts                    # Axios interceptor: token attach/refresh
│   │   └── endpoints/
│   │       ├── auth.ts
│   │       ├── onboarding.ts
│   │       ├── jobs.ts
│   │       ├── applications.ts
│   │       ├── agent.ts
│   │       └── notifications.ts
│   ├── signalr/
│   │   └── agentHubConnection.ts             # SignalR client connection setup
│   ├── types/
│   │   ├── screeningQuestion.ts              # jsonb schema field types
│   │   └── ... (shared DTO/type mirrors of backend DTOs)
│   └── assets/
│
├── public/
│   └── (SEO meta tag templates for job listing pages)
│
├── index.html
├── vite.config.ts
├── Dockerfile
└── package.json
```

## Cross-Cutting Conventions (Frontend Slice)

- **Naming:** PascalCase for components (`ReviewCard.tsx`); camelCase for hooks/utilities (`useAgentChatMutation.ts`).
- **Layering:** `pages/` compose `components/`; `components/` never import from `pages/`. Server state always flows through `queries/`; client/session state always flows through `context/` or `store/`.
- **Shared schema contract:** the `screening_questions` / `answers` field-type map in `types/screeningQuestion.ts` **must remain identical** to the backend DTO shape — this satisfies the requirement that builder, preview, and seeker form render identically (see [04-dynamic-screening-form.md](04-dynamic-screening-form.md)).
- **Tool extensibility awareness:** every new Agentic AI tool the backend adds shows up as a new response shape under `api/endpoints/agent.ts` and a new renderer branch in the chat page — no orchestrator logic lives in the frontend itself.
- **Secrets:** `LLM_API_KEY` and `JWT_SIGNING_SECRET` must **never** appear anywhere under `/frontend/src` or in any `.env` committed to this project. Only `VITE_API_BASE_URL` and `VITE_SIGNALR_HUB_URL` belong in the frontend environment.

## Implementation Checklist

- [ ] Set up route-based code splitting into Public, Auth, JobSeeker, Recruiter groups
- [ ] Build `DynamicFormRenderer` as a single shared component consumed by builder, preview, and seeker form
- [ ] Place `PersistentChatIcon` and `AiDisclaimerBanner` in common components, rendered globally when logged in
- [ ] Use React Query hooks under `queries/` for all server-state fetching (jobs, applications, credits, notifications)
- [ ] Use `AuthContext` + `sessionStore` (Zustand) for auth/session and chat in-flight-request state
- [ ] Configure Axios interceptor in `api/axiosClient.ts` for JWT attach + refresh
- [ ] Configure SignalR client in `signalr/agentHubConnection.ts` for reasoning-trace streaming
- [ ] Mirror backend DTO shapes under `types/` for the `screening_questions` / `answers` jsonb contracts
- [ ] Audit `/frontend/src` to confirm no server-side secret ever appears in source or bundle
