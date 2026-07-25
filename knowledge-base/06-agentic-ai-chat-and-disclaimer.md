# Agentic AI Chat, Credits & Disclaimer (Frontend)

**Derived from:** SRS v3.1 §6 (Agentic AI Ecosystem & Rate Limit Infrastructure)

## 1. Chat UI Placement & Session Rate Limiting

- A **persistent chat icon** is docked in the bottom-right corner, available on every page while logged in.
- Clicking it opens a **dedicated full-page chat view in the same tab** — not a side-panel drawer, not a new tab.
- The chatbot is limited to **one in-flight/running request per user session** — the message input must be disabled (with a subtle loading indicator) while a previous message is still processing. This limit is independent of AI credit balance; it exists to control concurrent load/cost.

## 2. The 6 Agent Tools (Frontend Awareness)

The frontend does not implement tool logic, but the chat UI must correctly render the outcome of each tool and its credit cost as returned by the backend:

| Agent / Tool | Credit Cost | What the Frontend Renders |
|---|---|---|
| Job Search & Match Agent | 5 | Ranked job list with Match Score badges |
| Application Autofill Agent | 10 | Review Card flow (see §4 below) |
| Application Status Tool | 2 | Current pipeline stage, inline in chat |
| Bulk Apply Agent | 10/app | Bulk Apply batch review screen |
| JD Generation Agent (Recruiter) | 15 | JD draft editor (editable, not auto-published) |
| Candidate Screening Agent (Recruiter) | 5/candidate | Candidate Screening suggestion panel (non-mutating) |

## 3. Human-in-the-Loop (HITL) Guardrail

Irreversible actions (final application submission, JD publish, bulk apply) **require an explicit UI confirm button click** — never auto-execute from a chat response. This is a hard, non-negotiable UI rule enforced across every AI-touched flow.

## 4. Interactive Autofill — 4-Phase Loop (Frontend Behavior)

The Application Autofill Agent's four phases and what the frontend must do at each:

1. **Auto-Resolution Phase** — backend pre-fills answers from profile/resume data; frontend has nothing to do yet.
2. **Interactive Pause-and-Prompt Phase** — if required questions couldn't be mapped, the backend halts and the frontend must show a **client-side prompt UI**, asking the candidate for the missing input with the natural-language guidance text returned by the API.
3. **Candidate Review & Inline Edit Phase** — render all pre-filled/prompted answers in an interactive **Review Card**: one card per question, each with an inline edit control. If a candidate edits a value, show a **"Save to profile"** toggle for persisting it back.
4. **Human-in-the-Loop Submission Phase** — the final payload stays locked (submit button disabled/inactive) until the candidate explicitly clicks **"Confirm & Submit Application."**

## 5. AI Credit & Context Guardrails (Frontend Display Rules)

- **Credit meter:** a small persistent widget (e.g., top nav) showing `balance / quota` (e.g., "350 / 500 credits") with a progress bar; color shifts toward Warning as balance approaches zero. Always visible, not just during AI actions.
- **Zero-credit behavior:** a blocked AI action must show an **Upgrade prompt with a "Coming Soon" placeholder** — never a dead-end error. This is a distinct UI state from a generic error (see [15-ui-ux-design-reference.md](15-ui-ux-design-reference.md) §5, "AI-blocked state").
- **Platform rate limit:** if the backend returns the rate-limit condition, show an **"AI Busy — Please try again shortly"** message. This must not deduct/change the credit meter.
- **Context size limits (informational only, enforced server-side):** resume uploads capped at 1MB; resume text truncated to ~12,000 characters before the LLM ever sees it; chat context is a sliding buffer of the last 6 turns. The frontend should client-side validate the 1MB upload cap for UX but must not attempt to enforce the text/turn limits itself.

## 6. AI Disclaimer — Responsible AI Notice

- A persistent, visible disclaimer must accompany **all** AI-generated output: e.g., *"This response is AI-generated and may contain mistakes. Please double-check before relying on it."*
- **Applies to:** chatbot responses, AI-drafted application answers, AI-generated job descriptions, AI-generated company descriptions, and AI match/ranking explanations.
- **Placement:** persistently in the chatbot UI footer, **and** inline near any AI-drafted content the user is asked to review/confirm before submission (autofilled answers, generated JD, screening suggestions).
- Build this as a single shared `AiDisclaimerBanner` component reused everywhere AI output appears — never a one-off per screen.

## 7. UI Composition Notes

- **Chat Page:** full-page layout; user message bubbles; a visually distinct "reasoning trace" style (e.g., collapsible/streaming monospace-adjacent block) for agent thinking steps; final structured result (job cards, draft answers, etc.) rendered inline; input box disabled while in-flight; persistent disclaimer footer always visible.
- **Review Card:** card-per-question; inline edit icon per field; "Save to profile" toggle on edited fields; disclaimer directly below the card, above the (initially disabled) "Confirm & Submit Application" button.
- **Bulk Apply Review Screen:** list of eligible jobs (ATS ≥ 80%) with score badges; a single "Confirm Bulk Apply (N jobs)" button — no per-job confirmation.
- **JD Draft Editor:** shows the AI draft as editable text; publish button is only enabled after the recruiter has interacted with/edited the draft field (manual review is mandatory, never auto-publish).
- **Candidate Screening Suggestion Panel:** non-mutating sidebar/banner ("AI suggests: rank #1 — strong match") with the disclaimer attached; never changes an applicant's status itself.

## Implementation Checklist (Frontend)

- [ ] Build persistent bottom-right chat icon (visible on every page while logged in)
- [ ] Build dedicated full-page chat route (opens in same tab, not a drawer/new tab)
- [ ] Implement SignalR client connection + streaming reasoning-trace renderer
- [ ] Disable chat input while a request is in-flight (single in-flight rule); show loading indicator
- [ ] Build Review Card component (inline edit + "Save to profile" toggle)
- [ ] Lock "Confirm & Submit Application" until explicit user click; never auto-submit
- [ ] Build Interactive Pause-and-Prompt UI for unmapped required screening questions
- [ ] Build Bulk Apply batch review screen (ATS ≥ 80% list + single batch confirm button)
- [ ] Build JD draft editor with mandatory manual-edit/review gate before publish
- [ ] Build Candidate Screening suggestion panel (non-mutating, disclaimer attached)
- [ ] Build always-visible Credit Meter widget with color-shift-on-low-balance behavior
- [ ] Build "Coming Soon" Upgrade prompt for zero-credit blocked actions
- [ ] Build "AI Busy — Please try again shortly" toast/message for rate-limit responses
- [ ] Build shared `AiDisclaimerBanner` component; place in chat footer and inline near all AI-drafted content
- [ ] Client-side validate 1MB upload cap before sending resume files (UX courtesy only)

## Integration Points

- SignalR hub (`VITE_SIGNALR_HUB_URL`) for streaming chat/reasoning traces — see [11-local-dev-setup-frontend.md](11-local-dev-setup-frontend.md) for the env var.
- `POST /api/agent/chat`, `POST /api/agent/autofill`, `POST /api/agent/bulk-apply`, `POST /api/agent/generate-jd`, `POST /api/agent/screen-candidates`
- `GET /api/credits/balance`

See [14-api-contracts-frontend.md](14-api-contracts-frontend.md) for exact shapes and error codes (`AI_BUSY`, `CREDIT_EXHAUSTED`, `AI_GENERATION_FAILED`).
