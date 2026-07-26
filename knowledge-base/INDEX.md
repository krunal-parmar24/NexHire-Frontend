# Frontend Knowledge Base — Index

This is the entry point for a Frontend-only AI coding agent working on the Agentic AI Job Portal. Every file below is self-contained and derived exclusively from the source documents in `/references` (no invented requirements). Start with [01-product-overview.md](01-product-overview.md).

| File                                                                                         | Description                                                                                                  | Derived From                   |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| [01-product-overview.md](01-product-overview.md)                                             | Product purpose, frontend tech stack, in/out-of-scope features, priorities                                   | SRS §1, Implementation Plan §1 |
| [02-guest-browsing-and-application-gate.md](02-guest-browsing-and-application-gate.md)       | Guest job browsing/search, Apply login-gate flow, role-based post-login routing, withdraw UI rules           | SRS §2                         |
| [03-auth-onboarding-profile-management.md](03-auth-onboarding-profile-management.md)         | Login/Register UI, JWT handling, hard-wall onboarding wizard, profile editing screens                        | SRS §3                         |
| [04-dynamic-screening-form.md](04-dynamic-screening-form.md)                                 | Screening-question schema shape and the shared `DynamicFormRenderer` component contract                      | SRS §4, §7.2                   |
| [05-match-score-display.md](05-match-score-display.md)                                       | How to display the ATS match score/badge (display only, no scoring logic)                                    | SRS §5                         |
| [06-agentic-ai-chat-and-disclaimer.md](06-agentic-ai-chat-and-disclaimer.md)                 | Chat UI, streaming reasoning trace, autofill Review Card/HITL flow, credit meter, AI disclaimer              | SRS §6                         |
| [07-recruiter-dashboard-and-job-posting-ui.md](07-recruiter-dashboard-and-job-posting-ui.md) | Job posting wizard, screening builder UI, applicant management UI, recruiter dashboard, notifications        | SRS §7                         |
| [08-frontend-folder-structure.md](08-frontend-folder-structure.md)                           | React/Vite/PrimeReact folder structure and cross-cutting frontend conventions                                | Architecture Guide             |
| [09-implementation-plan-frontend-tracks.md](09-implementation-plan-frontend-tracks.md)       | Day 1–14 frontend-only task checklist, keeping Day numbering aligned with backend                            | Implementation Plan            |
| [10-coding-standards-frontend.md](10-coding-standards-frontend.md)                           | React/TypeScript coding standards, naming conventions, shared Git conventions (cross-referenced)             | Coding Standards               |
| [11-local-dev-setup-frontend.md](11-local-dev-setup-frontend.md)                             | Frontend local setup, env vars, pointer to backend Docker Compose                                            | Local Dev Setup                |
| [12-nfr-frontend.md](12-nfr-frontend.md)                                                     | User-facing performance targets and accessibility baseline                                                   | NFR                            |
| [13-testing-strategy-frontend.md](13-testing-strategy-frontend.md)                           | Frontend-testable manual test checklist by day + final regression checklist                                  | Testing Strategy               |
| [14-api-contracts-frontend.md](14-api-contracts-frontend.md)                                 | Full API contract reframed as a consumer reference (what to call, what shape to expect)                      | API Contracts                  |
| [15-ui-ux-design-reference.md](15-ui-ux-design-reference.md)                                 | Design tokens, layout patterns, screen-by-screen UI reference, shared component states, accessibility        | UI/UX Design Reference         |
| [16-deployment-frontend.md](16-deployment-frontend.md)                                       | Frontend Dockerfile, Render service config, `VITE_API_BASE_URL` (light stub; full pipeline is backend-owned) | CI/CD Pipeline                 |

## Cross-Reference Note

Backend implementation details (EF Core, repositories, LLM service internals, Redis rate limiting internals, full CI/CD pipeline mechanics) are intentionally **not** duplicated here. Where the frontend needs an integration point (API shape, SignalR hub URL, environment variable name, error code), it is included directly in the relevant file above.
