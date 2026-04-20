from typing import List, Optional, Tuple
from models import BusinessProfile, Grant, GrantRecommendation


def check_eligibility(profile: BusinessProfile, grant: Grant) -> Tuple[bool, Optional[str]]:
    if profile.applicant_type not in grant.applicant_type:
        readable = " or ".join(t.upper() for t in grant.applicant_type)
        return False, f"Requires {readable} applicant type"

    if profile.employee_count < grant.employee_count_min:
        return False, f"Minimum {grant.employee_count_min} employees required"

    if grant.employee_count_max is not None and profile.employee_count > grant.employee_count_max:
        return False, f"Maximum {grant.employee_count_max} employees"

    if "any" not in grant.revenue_band and profile.revenue_band not in grant.revenue_band:
        return False, "Annual revenue does not fall within the eligible band"

    if grant.requires_local_entity and not profile.has_local_entity:
        return False, "Requires a locally registered entity"

    if grant.requires_new_market and not profile.entering_new_market:
        return False, "Requires active entry into a new overseas market"

    return True, None


def score_grant(profile: BusinessProfile, grant: Grant) -> Tuple[float, List[str]]:
    if not grant.business_goals:
        return 0.0, []

    matched = [g for g in grant.business_goals if g in profile.business_goals]
    score = len(matched) / len(grant.business_goals)
    return score, matched


def match_grants(profile: BusinessProfile, grants: List[Grant]) -> List[GrantRecommendation]:
    results = []

    for grant in grants:
        eligible, reason = check_eligibility(profile, grant)
        score, matched_goals = score_grant(profile, grant)

        results.append(
            GrantRecommendation(
                grant=grant,
                score=score,
                matched_goals=matched_goals,
                eligible=eligible,
                ineligibility_reason=reason,
            )
        )

    results.sort(key=lambda r: (r.eligible, r.score), reverse=True)
    return results
