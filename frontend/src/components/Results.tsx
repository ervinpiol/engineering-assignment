import type { RecommendationResponse } from "../types";
import GrantCard from "./GrantCard";

interface Props {
  data: RecommendationResponse;
}

export default function Results({ data }: Props) {
  const eligible = data.recommendations.filter((r) => r.eligible);
  const ineligible = data.recommendations.filter((r) => !r.eligible);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          {eligible.length > 0
            ? `${eligible.length} eligible grant${eligible.length !== 1 ? "s" : ""}`
            : "No eligible grants"}
        </h2>
        {eligible.length === 0 && (
          <p className="text-sm text-slate-500 mt-1">
            No grants match your current profile. Try adjusting your company details or selecting
            different business goals.
          </p>
        )}
      </div>

      {eligible.length > 0 && (
        <div className="space-y-3">
          {eligible.map((r) => (
            <GrantCard key={r.grant.id} rec={r} />
          ))}
        </div>
      )}

      {ineligible.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer list-none flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors w-fit">
            <svg
              className="w-3 h-3 transition-transform group-open:rotate-90"
              viewBox="0 0 6 10"
              fill="currentColor"
            >
              <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {ineligible.length} grant{ineligible.length !== 1 ? "s" : ""} you don&apos;t currently
            qualify for
          </summary>
          <div className="mt-3 space-y-3">
            {ineligible.map((r) => (
              <GrantCard key={r.grant.id} rec={r} />
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
