# Coding Standards — React / TypeScript (Frontend)

**Derived from:** Coding Standards & Style Guide §1 (General Principles), §3 (React/TypeScript Frontend Standards), §4 (Naming Conventions — frontend rows), §6 (Git & Commit Conventions — shared)

## 1. General Principles

- Prefer explicit, readable code over clever/compact code — this is a portfolio project reviewed by interviewers, so clarity has interview value.
- Keep components/functions short and single-purpose; extract helper components/hooks rather than nesting deeply.
- The `DynamicFormRenderer` component must remain the single shared implementation consumed by the recruiter builder, the preview modal, and the seeker application form — never forked into role-specific copies (this is a hard architectural rule, not a style preference).

## 2. Project & File Organization

- Functional components only, using hooks — no class components.
- One component per file; file name in PascalCase matching the component export (e.g., `ReviewCard.tsx`).
- Co-locate component-specific styles/types in the same folder as the component when not shared elsewhere.

## 3. Component Patterns

- Props are typed via an explicit `interface <ComponentName>Props` declared directly above the component.
- Prefer composition over prop-drilling for more than 2 levels — lift shared state into `AuthContext` or `sessionStore` (Zustand) rather than threading props deeply.

## 4. State Management

- Server state (jobs, applications, credits, notifications) goes through React Query hooks under `queries/` — never fetched directly inside a component with `useEffect` + `fetch`.
- Client/session state (auth token, current chat in-flight flag, job-intent-preservation state) goes through `AuthContext` or Zustand's `sessionStore` — never duplicated into component-local state if it needs to persist across route changes.

## 5. Styling

- Use PrimeReact components and theme tokens as the default UI building blocks; avoid raw unstyled HTML form elements where a PrimeReact equivalent exists.
- Custom CSS is scoped per-component (CSS Modules or a scoped class prefix); no global style overrides outside a shared theme file.

## 6. TypeScript Conventions

- `strict: true` in `tsconfig.json`; no implicit `any`.
- `@typescript-eslint/no-explicit-any: error` in ESLint config. Zero-tolerance for `any` casting.
- Shared types (e.g., the `screening_questions` / `answers` field-type map) live under `types/` and must mirror the backend DTO shape exactly.
- Prefer discriminated unions for the 6 screening-question field types (`text | single-select | multi-select | file upload | yes/no | numeric`) so the renderer's `switch` statement is exhaustively type-checked.

## 7. Naming Conventions (Frontend Rows)

| Element                   | Convention                           | Example                                  |
| ------------------------- | ------------------------------------ | ---------------------------------------- |
| React component file      | PascalCase.tsx                       | `ApplicantManagementPage.tsx`            |
| React hook                | `use` + PascalCase                   | `useAgentChatMutation.ts`                |
| TypeScript type/interface | PascalCase                           | `ScreeningQuestion`, `ApplicationStatus` |
| CSS class (scoped)        | kebab-case                           | `.review-card__field`                    |
| API route consumed        | kebab-case, matches backend contract | `/api/agent/bulk-apply`                  |

> Backend naming conventions (C# classes, migrations, etc.) are documented in the Backend knowledge base's `11-coding-standards-backend.md` — not duplicated here.

## 8. Error Handling (Frontend-Relevant)

- AI/agent failures: no credit deduction happens on failure (backend rule), and the UI must show a clear inline error such as _"Something went wrong generating this — please try again"_ rather than a silent failure or generic crash.
- Never log JWT tokens or any secret to the browser console.

## 9. Git & Commit Conventions

Git/commit conventions are **shared and authoritative in the Backend knowledge base** (`backend/knowledge-base/11-coding-standards-backend.md`, §6) — apply the same Conventional Commits format and Implementation Plan Day-referencing convention here without re-deriving it:

- `<type>(<scope>): <description>` — types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `style`.
- Scope matches the frontend task area (e.g., `feat(onboarding): add resume upload widget`).
- Reference the Implementation Plan Day number in the PR description (e.g., "Implements Day 5 — Dynamic Application Form & Submission Rules (Frontend)").

## 10. Task Completion Standards

- After completing all changes, ensure the project passes all **type-check** and **lint** validations without errors.
- Run **Prettier** to automatically format the codebase and resolve any formatting issues before marking the task as complete.

## Implementation Checklist

- [x] Enable TypeScript `strict: true` in `tsconfig.json`
- [x] Create shared `types/screeningQuestion.ts` discriminated union for the 6 field types
- [x] Add ESLint + Prettier config enforcing the naming conventions above (including `no-explicit-any`)
- [x] **Server state**: React Query hooks under `api/hooks/`, which in turn call pure Axios functions under `api/endpoints/`. Never inline raw `api.get/post` inside a hook or fetch directly inside a component with `useEffect` + `fetch`.
- [x] **Client/session state**: `AuthContext` (localStorage-backed) — no Zustand `sessionStore` despite KB spec; no ad-hoc component state for cross-route data
- [ ] Adopt Conventional Commits format for all commits/PRs (per the shared convention referenced above)
