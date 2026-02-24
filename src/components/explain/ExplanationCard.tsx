export function ExplanationCard({ explanation }: { explanation: string }) {
  return (
    <div className="mt-6 bg-slate-800 border border-slate-700 p-5 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">AI Reasoning</h3>
      <p className="text-slate-300 leading-relaxed whitespace-pre-line">
        {explanation}
      </p>
    </div>
  );
}