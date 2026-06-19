export default function ProgressTierBar({ qualified }: { qualified: number }) {
  const tiers = [
    { target: 1, reward: "+1 Spin" },
    { target: 3, reward: "+50 Coins" },
    { target: 10, reward: "+0.05 TON" }
  ];

  const nextTier = tiers.find(t => qualified < t.target) || tiers[2];

  return (
    <div className="glass-panel p-5">
      <h2 className="text-sm font-bold text-slate-700 mb-1">Progress to Next Tier</h2>
      <p className="text-xs text-slate-500 mb-4">
        Qualified: {qualified} / {nextTier.target}
      </p>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${Math.min((qualified / nextTier.target) * 100, 100)}%` }}
        />
      </div>
      <p className="text-xs text-right font-bold text-amber-500">
        Reward: {nextTier.reward}
      </p>
    </div>
  );
}
