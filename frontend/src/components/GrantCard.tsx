import { GOAL_LABELS } from "../constants";
import type { GrantRecommendation } from "../types";

interface Props {
  rec: GrantRecommendation;
}

export default function GrantCard({ rec }: Props) {
  const { grant, matched_goals, eligible, ineligibility_reason } = rec;

  return (
    <div
      className={`rounded-xl border p-5 transition-opacity ${
        eligible ? "bg-white border-slate-200" : "bg-slate-50 border-slate-200 opacity-55"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-900 text-sm">{grant.name}</h3>
            {eligible ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block shrink-0" />
                Eligible
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5">
                Not eligible
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{grant.summary}</p>
        </div>

        {eligible && matched_goals.length > 0 && (
          <span className="shrink-0 text-xs font-medium text-blue-600 tabular-nums whitespace-nowrap">
            {matched_goals.length} goal{matched_goals.length !== 1 ? "s" : ""} matched
          </span>
        )}
      </div>

      {eligible && matched_goals.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {matched_goals.map((g) => (
            <span
              key={g}
              className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-0.5"
            >
              {GOAL_LABELS[g] ?? g}
            </span>
          ))}
        </div>
      )}

      {!eligible && ineligibility_reason && (
        <p className="mt-2 text-xs text-slate-400">{ineligibility_reason}</p>
      )}

      {eligible && grant.notes.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3">
          {grant.notes.map((note, i) => (
            <li key={i} className="text-xs text-slate-400 flex gap-2">
              <span className="shrink-0 text-slate-300">–</span>
              {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
