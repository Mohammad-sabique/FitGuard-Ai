export function FeatureContributions({ contributions }: any) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Feature Contributions</h3>

      {contributions.map((c: any, i: number) => (
        <div key={i} className="mb-4">
          <div className="flex justify-between text-sm text-slate-400 mb-1">
            <span>{c.feature}</span>
            <span>{Math.round(c.weight * 100)}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${c.weight * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}