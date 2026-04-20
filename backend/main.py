import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from matcher import match_grants
from models import BusinessProfile, Grant, RecommendationResponse

app = FastAPI(title="Grantbii Recommendation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

_grants_raw = json.loads((Path(__file__).parent / "grants.json").read_text())
GRANTS = [Grant(**g) for g in _grants_raw]


@app.post("/api/recommendations", response_model=RecommendationResponse)
def get_recommendations(profile: BusinessProfile) -> RecommendationResponse:
    return RecommendationResponse(recommendations=match_grants(profile, GRANTS))
