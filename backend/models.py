from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class BusinessProfile(BaseModel):
    employee_count: int = Field(..., ge=1)
    revenue_band: Literal["under_100m", "over_100m"]
    applicant_type: Literal["sme", "non_sme"]
    has_local_entity: bool
    entering_new_market: bool
    business_goals: List[str]


class Grant(BaseModel):
    id: str
    name: str
    summary: str
    supports: List[str]
    applicant_type: List[str]
    employee_count_min: int
    employee_count_max: Optional[int]
    revenue_band: List[str]
    business_goals: List[str]
    requires_local_entity: bool
    requires_new_market: bool
    notes: List[str]


class GrantRecommendation(BaseModel):
    grant: Grant
    score: float
    matched_goals: List[str]
    eligible: bool
    ineligibility_reason: Optional[str] = None


class RecommendationResponse(BaseModel):
    recommendations: List[GrantRecommendation]
