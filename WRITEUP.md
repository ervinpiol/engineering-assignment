# Write-up

## Running locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Runs at http://localhost:8000. Interactive API docs at http://localhost:8000/docs.

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Runs at http://localhost:5173. The Vite dev server proxies `/api` to the backend, so no CORS configuration is needed during development.

---

## Assumptions

- **Local entity** means the company is registered in Singapore (ACRA). The form defaults to `true` since most grant applicants have this. Companies without it are ineligible for every grant in the dataset, so the result is informative rather than surprising.
- **SME / non-SME** is self-declared via the form. In practice this is determined by Enterprise Singapore's criteria (≤200 employees and ≤S$100M turnover), but since both fields are captured separately, the UI lets users declare their classification directly.
- **Revenue band** `under_100m` corresponds to the standard SME threshold. `over_100m` is the only other category; the dataset doesn't require finer granularity.
- **Business goals** are not mutually exclusive. A company can select several simultaneously (e.g., automation + hiring), and grants are scored based on overlap with the full selection.
- **`requires_new_market`** on MRA is treated as a binary: either the company is actively entering a new overseas market, or it isn't. The intent vs. active-entry distinction is not captured (see open questions).
- Grants with `revenue_band: ["any"]` have no revenue restriction.

---

## Matching logic

**Eligibility** is checked first via hard rules. A grant is ineligible if any of the following fail:

- applicant type mismatch (e.g., non-SME applying to an SME-only grant)
- employee count below the grant minimum
- revenue band outside the eligible range
- local entity not present when required
- not entering a new market when required

**Relevance score** = `matched_goals / total_grant_goals`. A grant that covers all of a user's selected goals scores 1.0; one that partially overlaps scores proportionally lower. Grants score 0 when the user selects no goals, but remain visible as eligible options. Eligible grants are sorted by score descending; ineligible grants are collapsed in a disclosure element.

---

## Tradeoffs

**Rule-based matching vs. semantic/NLP matching.** Structured fields make the matching transparent and auditable — you can read the rules and reason about why a grant appeared or didn't. The tradeoff is that users must accurately map their situation to the form options. A free-text input backed by embeddings would be more forgiving, but adds non-determinism and makes it harder to explain results.

**Ineligible grants shown, not hidden.** Seeing the reason for ineligibility (e.g., "Minimum 30 employees required") is actionable information. A company at 28 employees behaves differently than one at 5. The collapsible section keeps the primary view clean.

**Stateless API.** No auth, no persistence. Appropriate for this scope. A production version would save profiles, track applications, and support returning users.

**Grants loaded at startup.** The backend reads `grants.json` once on boot. Fast and simple for a small, stable dataset. For a larger or frequently-updated dataset, a database with a cache layer would be the right call.

**Validation on both sides.** The frontend validates before submitting (UX); FastAPI/Pydantic validates the request body (correctness). This is intentional belt-and-suspenders — not redundancy for its own sake.

---

## Open questions

- **MRA new market requirement**: should this distinguish between *intent* (planning to expand) and *active process* (already in market)? The current boolean collapses both.
- **Overlapping grant scope**: DLP and EDG-NPD both support digital innovation work. Should the system group or rank them relative to each other, or surface them independently as it does now?
- **Zero goals selected**: currently all eligible grants show with score 0, ordered arbitrarily. An alternative is prompting the user to select at least one goal before showing results, or showing a different empty state that explains the ranking.
- **Partial eligibility signals**: a company just below a threshold (e.g., 28 employees for a 30-minimum grant) might benefit from seeing "you're close — this grant requires 2 more employees" rather than a flat ineligible label.
