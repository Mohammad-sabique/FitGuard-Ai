"use client";

import { useState } from "react";
import { PoseCapture } from "@/components/pose/PoseCapture";
import { FoodEstimator } from "@/components/food/FoodEstimator";
import { FeatureContributions } from "@/components/explain/FeatureContributions";
import { ExplanationCard } from "@/components/explain/ExplanationCard";

export default function AssessmentPage() {
  const [pose, setPose] = useState<any>(null);
  const [food, setFood] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
  setLoading(true);
  const res = await fetch("/api/assess", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profile: { age: 22, weight: 70, height: 170, goal: "fitness" },
      poseSummary: pose,
      foodEstimate: food,
    }),
  });

  const data = await res.json();
  setResult(data);
  setLoading(false);
};

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold">AI Assessment Dashboard</h1>
          <p className="text-slate-400 mt-2">
            Multimodal evaluation combining posture and nutrition data.
          </p>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT PANEL */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <PoseCapture onSummary={setPose} />
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <FoodEstimator onEstimate={setFood} />
            </div>

            <button
              onClick={run}
              disabled={loading}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {loading ? "Processing AI..." : "Run AI Decision Engine"}
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            {!result ? (
              <div className="text-slate-500 text-center mt-20">
                Awaiting AI assessment...
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>AI Fitness Score</span>
                    <span>{result.score}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                </div>

                <FeatureContributions contributions={result.contributions} />
                <ExplanationCard explanation={result.explanation} />
              </>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}