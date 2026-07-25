# Non-Functional Requirements (Frontend)

**Derived from:** NFR Guide §1 (Context & Intent), §2 (Performance Targets — user-facing rows), §6 (Security Posture — frontend-relevant row)

**See also:** UI/UX Design Reference §6 (Accessibility Baseline)

## 1. Context

This project is a **portfolio-grade demonstration**, not an enterprise production system: solo developer/agent, 14-day timeline, no dedicated QA team. Frontend NFR targets are calibrated for a convincing live recruiter/interviewer demo, not high-scale production traffic.

## 2. User-Facing Performance Targets

| Interaction | Target | Notes |
|---|---|---|
| Guest job listing page load | < 1.5s | Must remain fast since guest browsing/SEO is a P0 feature |
| Job detail page load | < 1s | |
| Login / Register | < 1s | Excludes onboarding wizard steps |
| Agent chat first-token latency (perceived) | < 3s | Streaming should visibly begin before the full response completes — build the reasoning-trace renderer to reflect partial content as soon as it arrives, not wait for a complete payload |

> Actual latency for AI-dependent operations is bounded by the backend's LLM provider and rate limits — the frontend's job is to communicate progress (loading skeletons, streaming indicators) rather than to hide latency.

## 3. Availability & Reliability (Frontend-Relevant)

- **Graceful degradation:** when the AI platform rate limit or a user's credit balance is exhausted, manual (non-AI) job search and application flows must remain 100% usable in the UI — never let an AI-blocked state disable unrelated manual flows.
- **AI failure isolation:** a failed or timed-out AI call must never crash the surrounding page/flow — show an inline error and leave the rest of the application interactive.
- Render's free/starter tier may cold-start after inactivity — treat this as an accepted trade-off; consider a lightweight loading state on first load rather than treating a slow cold-start as a bug.

## 4. Security Posture (Frontend-Relevant)

- LLM API keys and JWT signing secrets must never be exposed to the React frontend or committed to source control. Only the access/refresh tokens the backend issues may live in frontend memory/storage.
- Role permanence (Job Seeker vs. Recruiter) and recruiter data scoping are enforced **server-side** — the frontend must not rely on hiding UI elements as its only access control; always handle `403`/`401` responses gracefully as a defense-in-depth measure.

## 5. Accessibility Baseline

- All interactive elements reachable via keyboard (Tab/Enter) — lean on PrimeReact's built-in accessibility support rather than custom-building it.
- Sufficient color contrast for status tags — never rely on color alone; pair with a text label (e.g., "Hired" text plus a green tag, not just a green dot).
- Form fields have associated labels (not placeholder-only), especially important for the dynamic screening form where field types vary.
- Deep mobile-responsive polish is explicitly **out of scope** — basic usability (no horizontal scroll/broken layout) is the only bar, not full responsive optimization.

## Implementation Checklist

- [ ] Verify guest job listing and job detail pages meet stated load-time targets under normal conditions
- [ ] Build the reasoning-trace renderer to display partial/streaming content as it arrives, not just the final response
- [ ] Verify manual job search/application flows remain fully usable when an AI-blocked state is shown elsewhere in the UI
- [ ] Verify no failed/timed-out AI call can crash or block the surrounding page
- [ ] Confirm no secret ever appears in the frontend bundle, browser storage, or console logs
- [ ] Verify keyboard navigability across all interactive elements
- [ ] Verify all status tags pair color with text (not color-only)
- [ ] Verify all dynamic form fields have real labels, not placeholder-only text
- [ ] Verify basic mobile usability (no broken layout/horizontal scroll) without pursuing deep responsive polish
