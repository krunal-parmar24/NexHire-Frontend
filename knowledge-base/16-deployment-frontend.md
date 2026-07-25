# Deployment & Environment Variables (Frontend Stub)

**Derived from:** CI/CD Pipeline (GitHub Actions + GHCR + Render) — Frontend-relevant slice only

> The full CI/CD pipeline (workflows, GHCR push, Render registry configuration, rollback procedure) is owned by the backend track and documented in the Backend knowledge base's `16-cicd-pipeline.md`. This file is intentionally a short stub covering only what the frontend needs to know about its own deployment.

## 1. Frontend Dockerfile

`/frontend/Dockerfile` (multi-stage: Node build → Nginx runtime):

```dockerfile
# ---- Build Stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Runtime Stage ----
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 2. Render Service (Frontend)

| Setting | Value |
|---|---|
| Deploy method | Existing Image / Docker Registry (Render pulls from GHCR — it never builds from source) |
| Image URL | `ghcr.io/<owner>/<repo>-frontend:latest` |
| Port | `80` (matches Nginx Dockerfile `EXPOSE`) |
| Environment | `VITE_API_BASE_URL` pointing to the deployed backend service |

CI (GitHub Actions) builds and pushes this image to GHCR on every push to `main` under the `frontend/**` path filter, then triggers this Render service's Deploy Hook. The frontend repo does not need its own copy of the GitHub Actions workflow logic — it only needs the `Dockerfile`, `nginx.conf`, and this environment variable configured in Render.

## 3. Environment Variable

| Variable | Location | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | Render frontend service env var | Points the built frontend bundle to the deployed backend API URL |

No other secret or environment variable belongs in the frontend service — `LLM_API_KEY`, `JWT_SIGNING_SECRET`, database, and Redis configuration are backend-only concerns (see Backend KB).

## Implementation Checklist (Frontend)

- [ ] Add `/frontend/Dockerfile` (multi-stage: Node build → Nginx runtime) + `nginx.conf`
- [ ] Create Render frontend Web Service configured as "Deploy from Existing Image / Docker Registry"
- [ ] Configure `VITE_API_BASE_URL` in the Render frontend service pointing to the backend service URL
- [ ] Verify production build (`npm run build`) output serves correctly from the Nginx container locally before relying on CI
