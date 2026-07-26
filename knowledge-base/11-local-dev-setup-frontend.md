# Local Development Setup (Frontend)

**Derived from:** Local Development Setup Guide §1 (Prerequisites), §4.2 (Frontend Env Vars), §6 (Frontend Local Setup), §8 (Running the Full Stack)

## 1. Prerequisites

| Tool    | Version | Purpose            |
| ------- | ------- | ------------------ |
| Node.js | 20.x    | Frontend build/run |
| Git     | Latest  | Version control    |

> Database (Postgres/pgvector) and Redis run only on the **backend** side via Docker Compose — see the one-line pointer in §3 below. The frontend has no direct dependency on either.

## 2. Environment Variables — `/frontend/.env.example`

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_SIGNALR_HUB_URL=http://localhost:8080/hubs/agent
```

- Copy `.env.example` to `.env` locally and fill in real values. `.env` must be git-ignored; only `.env.example` is committed.
- **Never** place `LLM_API_KEY` or `JWT_SIGNING_SECRET` (or any other server-side secret) in any frontend `.env` file — these are backend-only, per the platform's secrets rule.

## 3. Backend/Infra Dependency (Pointer Only)

The frontend talks to a locally running backend API at `http://localhost:8080`. That backend depends on local Postgres (pgvector-enabled) and Redis containers started via `docker-compose.local.yml` at the repo root. **Start the backend and its Docker Compose services first** — see the Backend knowledge base's `12-local-dev-setup-backend.md` for the full Docker Compose file and backend startup steps. The frontend itself requires no Docker services.

## 4. Frontend Local Setup

```bash
cd frontend

# Install dependencies
npm ci

# Run dev server (Vite)
npm run dev
```

- Frontend dev server runs at `http://localhost:5173` by default (Vite default port).
- Confirm `VITE_API_BASE_URL` in `.env` points to the locally running backend (`http://localhost:8080`).
- Confirm `VITE_SIGNALR_HUB_URL` matches the backend's SignalR hub route (`http://localhost:8080/hubs/agent`).

## 5. Running the Full Stack (Frontend's Place in the Order)

Recommended order every time you start local development:

1. Backend starts its local Postgres + Redis via Docker Compose (see Backend KB).
2. Backend API runs (`dotnet run --project src/JobPortal.Api`).
3. **`cd frontend && npm run dev`** (this repo's responsibility).
4. Open `http://localhost:5173`, log in via Quick Demo Login, verify guest browsing, onboarding, and chat all reach the local backend.

## 6. Troubleshooting (Frontend-Relevant)

| Symptom                                             | Likely Cause                                                                        | Fix                                                                                        |
| --------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| SignalR client can't connect                        | `VITE_SIGNALR_HUB_URL` mismatch or backend CORS not configured for `localhost:5173` | Verify the env var; confirm with backend that its CORS policy includes the frontend origin |
| API calls return CORS errors                        | Backend CORS policy doesn't include frontend origin                                 | Confirm with backend team/config — this is a backend-side fix                              |
| Resume parse returns empty fields                   | Backend `LLM_API_KEY` missing/invalid, or file exceeds 1MB cap                      | Check file size client-side first; if under 1MB, this is a backend-side issue              |
| "AI Busy" message immediately on first chat message | Backend/Redis token bucket not reset from a previous session                        | Backend-side fix (flush local Redis) — not a frontend issue                                |

## Implementation Checklist

- [ ] Create `/frontend/.env.example` with `VITE_API_BASE_URL` and `VITE_SIGNALR_HUB_URL`
- [ ] Add `.env` to `.gitignore` in `/frontend`
- [ ] Verify `npm ci && npm run dev` boots the SPA at `http://localhost:5173`
- [ ] Verify the SPA successfully reaches a locally running backend at `http://localhost:8080` for both REST and SignalR calls
- [ ] Confirm no server-side secret is ever required in, or added to, `/frontend/.env`
