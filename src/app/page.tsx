import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-28 text-center">
        <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          FitGuard AI
        </h1>

        <p className="mt-6 text-xl text-slate-400">
          Multimodal, Explainable Fitness & Nutrition Decision Support System
        </p>

        <p className="mt-6 max-w-2xl mx-auto text-slate-500 leading-relaxed">
          Real-time posture analysis. Meal recognition. Transparent AI scoring.
          A unified decision engine built for intelligent fitness guidance.
        </p>

        <div className="mt-12">
          <Link
            href="/assessment"
            className="bg-white text-black px-8 py-3 rounded-lg text-lg font-medium hover:scale-105 transition-transform"
          >
            Launch Assessment
          </Link>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="py-20 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl hover:border-blue-500 transition">
            <h3 className="text-xl font-semibold">Multimodal AI</h3>
            <p className="mt-4 text-slate-400">
              Combines pose estimation, image analysis, and structured user data 
              into a single unified intelligence layer.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl hover:border-purple-500 transition">
            <h3 className="text-xl font-semibold">Decision Engine</h3>
            <p className="mt-4 text-slate-400">
              Weighted scoring integrates posture quality, calorie estimation,
              and user goals to generate adaptive recommendations.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl hover:border-pink-500 transition">
            <h3 className="text-xl font-semibold">Explainable Output</h3>
            <p className="mt-4 text-slate-400">
              Transparent feature contributions and natural-language reasoning
              make every AI decision interpretable.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}