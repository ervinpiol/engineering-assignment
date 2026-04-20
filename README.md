# Grantbii Software Engineering Assignment

This assignment is based on a simplified version of a real product problem we have worked on at Grantbii.

## The task

Build a small application that allows a user to enter a business profile and receive relevant grant recommendations.

A simplified grant dataset is included in this repository for use in the assignment. You may interpret, transform, or extend it if useful, but please explain any meaningful changes.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Python, FastAPI, Uvicorn, Pydantic |
| Package manager | pnpm (frontend), pip (backend) |

## Features

- **Business profile form** — enter applicant type, employee count, revenue band, entity registration status, market expansion intent, and business goals
- **Grant matching** — eligibility checked against hard criteria (applicant type, headcount, revenue band, local entity, new market)
- **Relevance scoring** — grants ranked by how many business goals align with the profile
- **Ineligibility reasons** — each ineligible grant shows why it did not qualify
- **Sorted results** — eligible grants first, then ordered by match score

## Prerequisites

- Node.js ≥ 18
- pnpm (`npm install -g pnpm`)
- Python ≥ 3.11

## Running Locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at `http://localhost:8000`.

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

UI runs at `http://localhost:5173`.

Open `http://localhost:5173` in your browser. Backend must be running first.

## Scope

Your solution should include:

- a web UI
- a backend service

## Submission

Please complete the assignment in a private repository and grant reviewer access using the contact details provided in our email, or provide equivalent access on your chosen platform when you are ready for review.

Please also include:

- instructions for running the project locally
- a short write-up covering your assumptions, open questions, and tradeoffs

## Guidance

Treat this like a real piece of engineering work, while keeping the scope proportionate to the assignment.

Your submission should be straightforward for another engineer to run, review, and reason about.

A thoughtful, well-scoped solution is better than a broad one.

We are not looking for maximum feature count or polish for its own sake.

## Write-up

### Assumptions

- Grant dataset is static — no DB needed; loaded from JSON at startup.
- "Applicant type" maps directly to grant `eligible_applicant_types` field; unrecognised types fail all grants that restrict by type.
- Revenue band and headcount are ranges, not exact values — eligibility checked as overlap, not point match.
- "Local entity" means the business is registered in the grant's target jurisdiction; modelled as a boolean.
- "New market" intent is a binary flag — grants that require market-expansion intent are ineligible if flag is false.
- Goal matching is best-effort: partial overlap scores higher, no overlap scores zero but does not disqualify.
- Frontend talks directly to `localhost:8000`; no auth, no CORS complexity beyond dev permissiveness.

### Open Questions

- How should grants with no `eligible_applicant_types` constraint behave — open to all, or excluded? Currently treated as open to all.
- Should ineligible grants be hidden or shown with reasons? Shown with reasons — reviewers confirmed this is useful signal.
- Is revenue band an exclusive range or inclusive? Assumed inclusive on both bounds.
- What happens when multiple grants tie on score? Currently stable-sorted by original dataset order; a secondary sort key (e.g. grant amount) might be more useful.
- Should the dataset be extensible by users at runtime, or is it admin-managed? Not addressed — treated as read-only fixture.

### Tradeoffs

- **In-memory grant store vs. database**: keeps the stack minimal and startup instant; breaks down if dataset grows to thousands of records or needs live updates.
- **Python/FastAPI vs. Node backend**: FastAPI gives clean Pydantic validation and auto-generated OpenAPI docs with minimal boilerplate; tradeoff is a second runtime alongside Node.
- **Hard eligibility gates + soft scoring**: clean separation makes logic auditable but requires every criterion to be explicitly modelled — ambiguous criteria default to "pass" which may over-include.
- **No auth layer**: acceptable for an assignment scope; real product would need at minimum API key gating on the backend.
- **Vite dev proxy not used**: frontend hits backend directly; simpler for local dev but means CORS headers must be set on the API, and the origin must be updated for any non-local deploy.
