import { PiFire, PiGift } from "react-icons/pi";

export function StreakBadge({ streak }: { streak: number }) {
  if (streak <= 0) return null;
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold
      text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
      <PiFire size={14} className="text-amber-500" /> {streak} day streak
    </div>
  );
}

export function BonusBadge({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold
      text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
      <PiGift size={14} className="text-indigo-500" /> {count} Bonus Spin{count !== 1 ? 's' : ''}
    </div>
  );
}
