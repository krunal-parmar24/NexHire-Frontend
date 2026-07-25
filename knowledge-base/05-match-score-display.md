# ATS Match Score — Display Only (Frontend)

**Derived from:** SRS v3.1 §5 (ATS Match Scoring Engine)

> The scoring **logic** (weights, redistribution rules, certification matching) is computed entirely server-side. The frontend's only responsibility is to **display** the score and its breakdown clearly. Do not reimplement or duplicate the scoring math in frontend code.

## 1. What the Frontend Receives

`GET /api/jobs/{id}/match-score` returns an overall percentage plus a per-pillar breakdown:

```json
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

For context (not to be recomputed client-side): the four pillars are Skills Coverage, Experience Fit, Certification Match, and Domain/Title Match. When a job posting has no certification requirement, `certificationWeightRedistributed` is `true` and the weights shown will already reflect the redistribution (Skills +15%, Experience +5%, Certification 0%) — the UI just renders whatever weight/score values the API returns.

## 2. Where This Appears in the UI

- **Match Score badge** on job cards in the listing/search results (authenticated Job Seeker view only — hidden for guests).
- **Match Score badge** on the job detail page header (authenticated Job Seeker view only).
- A **tooltip/expandable breakdown** showing the four pillars, their weights, and their individual scores.
- Recruiter-side candidate ranking (via the Candidate Screening Agent suggestion panel) reuses the same badge component for consistency — see [07-recruiter-dashboard-and-job-posting-ui.md](07-recruiter-dashboard-and-job-posting-ui.md).

## Implementation Checklist (Frontend)

- [ ] Build a `MatchScoreBadge` component showing the overall percentage
- [ ] Build a pillar-breakdown tooltip/popover (weight + score per pillar)
- [ ] Hide the Match Score badge entirely for guest (unauthenticated) users
- [ ] Reuse `MatchScoreBadge` in both the job listing card and job detail page
- [ ] Reuse `MatchScoreBadge` in the recruiter's Candidate Screening suggestion panel

## Integration Points

- `GET /api/jobs/{id}/match-score` (Job Seeker view)
- Score data also appears embedded in Job Search & Match Agent chat results and Candidate Screening Agent suggestions (see [06-agentic-ai-chat-and-disclaimer.md](06-agentic-ai-chat-and-disclaimer.md)).
