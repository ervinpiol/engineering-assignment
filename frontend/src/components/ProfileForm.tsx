import { type FormEvent, useState } from "react";
import { GOAL_LABELS } from "../constants";
import type { ApplicantType, BusinessProfile, RevenueBand } from "../types";

interface Props {
  onSubmit: (profile: BusinessProfile) => void;
  loading: boolean;
}

type FormState = {
  employee_count: string;
  revenue_band: RevenueBand;
  applicant_type: ApplicantType;
  has_local_entity: boolean;
  entering_new_market: boolean;
  business_goals: string[];
};

const INITIAL: FormState = {
  employee_count: "",
  revenue_band: "under_100m",
  applicant_type: "sme",
  has_local_entity: true,
  entering_new_market: false,
  business_goals: [],
};

const ALL_GOALS = Object.keys(GOAL_LABELS);

export default function ProfileForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL);

  function toggleGoal(goal: string) {
    setForm((f) => ({
      ...f,
      business_goals: f.business_goals.includes(goal)
        ? f.business_goals.filter((g) => g !== goal)
        : [...f.business_goals, goal],
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const count = parseInt(form.employee_count, 10);
    if (isNaN(count) || count < 1) return;
    onSubmit({ ...form, employee_count: count });
  }

  const pillClass = (active: boolean) =>
    `px-4 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${
      active
        ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
        : "border-slate-200 text-slate-600 hover:border-slate-300"
    }`;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-7">
      {/* Company */}
      <fieldset className="space-y-5">
        <legend className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Company
        </legend>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Company type</p>
          <div className="flex gap-3 flex-wrap">
            {(["sme", "non_sme"] as const).map((type) => (
              <label key={type} className={pillClass(form.applicant_type === type)}>
                <input
                  type="radio"
                  className="sr-only"
                  name="applicant_type"
                  value={type}
                  checked={form.applicant_type === type}
                  onChange={() => setForm((f) => ({ ...f, applicant_type: type }))}
                />
                {type === "sme" ? "SME" : "Non-SME / Enterprise"}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="employees" className="block text-sm font-medium text-slate-700 mb-1.5">
            Number of employees
          </label>
          <input
            id="employees"
            type="number"
            min={1}
            required
            value={form.employee_count}
            onChange={(e) => setForm((f) => ({ ...f, employee_count: e.target.value }))}
            placeholder="e.g. 25"
            className="w-36 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Annual revenue</p>
          <div className="flex gap-3 flex-wrap">
            {(
              [
                { value: "under_100m", label: "Under S$100M" },
                { value: "over_100m", label: "S$100M and above" },
              ] as { value: RevenueBand; label: string }[]
            ).map(({ value, label }) => (
              <label key={value} className={pillClass(form.revenue_band === value)}>
                <input
                  type="radio"
                  className="sr-only"
                  name="revenue_band"
                  value={value}
                  checked={form.revenue_band === value}
                  onChange={() => setForm((f) => ({ ...f, revenue_band: value }))}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {/* Situation */}
      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Situation
        </legend>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.has_local_entity}
            onChange={(e) => setForm((f) => ({ ...f, has_local_entity: e.target.checked }))}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Company is locally registered</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.entering_new_market}
            onChange={(e) => setForm((f) => ({ ...f, entering_new_market: e.target.checked }))}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Entering a new overseas market</span>
        </label>
      </fieldset>

      {/* Business goals */}
      <fieldset>
        <legend className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Business goals{" "}
          <span className="font-normal normal-case text-slate-400">— select all that apply</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {ALL_GOALS.map((goal) => {
            const selected = form.business_goals.includes(goal);
            return (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  selected
                    ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {GOAL_LABELS[goal]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={loading || !form.employee_count}
        className="w-full rounded-lg bg-blue-600 text-white font-medium py-2.5 text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Finding grants…" : "Find matching grants"}
      </button>
    </form>
  );
}
