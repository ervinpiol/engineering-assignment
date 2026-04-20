export type RevenueBand = "under_100m" | "over_100m";
export type ApplicantType = "sme" | "non_sme";

export interface BusinessProfile {
  employee_count: number;
  revenue_band: RevenueBand;
  applicant_type: ApplicantType;
  has_local_entity: boolean;
  entering_new_market: boolean;
  business_goals: string[];
}

export interface Grant {
  id: string;
  name: string;
  summary: string;
  supports: string[];
  notes: string[];
}

export interface GrantRecommendation {
  grant: Grant;
  score: number;
  matched_goals: string[];
  eligible: boolean;
  ineligibility_reason: string | null;
}

export interface RecommendationResponse {
  recommendations: GrantRecommendation[];
}
