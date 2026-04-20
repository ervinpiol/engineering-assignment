import type { BusinessProfile, RecommendationResponse } from "./types";

export async function fetchRecommendations(
  profile: BusinessProfile
): Promise<RecommendationResponse> {
  const res = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  if (!res.ok) {
    throw new Error(`Server returned ${res.status}`);
  }

  return res.json() as Promise<RecommendationResponse>;
}
