import { useRef, useState } from "react";
import { fetchRecommendations } from "./api";
import ProfileForm from "./components/ProfileForm";
import Results from "./components/Results";
import type { BusinessProfile, RecommendationResponse } from "./types";

export default function App() {
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(profile: BusinessProfile) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecommendations(profile);
      setResults(data);
      setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        80
      );
    } catch {
      setError("Could not reach the server. Make sure the backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-6 py-5">
          <h1 className="text-lg font-semibold text-slate-900">Grant Finder</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Enter your business profile to see which grants you may be eligible for.
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        <ProfileForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {results && (
          <div ref={resultsRef}>
            <Results data={results} />
          </div>
        )}
      </main>
    </div>
  );
}
