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
