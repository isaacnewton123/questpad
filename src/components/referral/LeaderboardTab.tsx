import { useState, useEffect } from "react";
import { PiTrophy } from "react-icons/pi";
import { apiFetch } from "../../lib/api";
import type { LeaderboardEntry } from "../../types/referral.types";

export default function LeaderboardTab() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ leaderboard: LeaderboardEntry[] }>("/leaderboard/referrals")
      .then(({ data }) => {
        setLeaders(data.leaderboard || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <PrizeBanner />
      <LeaderboardList leaders={leaders} loading={loading} />
    </div>
  );
}

function PrizeBanner() {
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 items-start">
      <PiTrophy className="text-amber-500 shrink-0 mt-0.5" size={20} />
      <div>
        <h3 className="text-sm font-bold text-amber-900">
          Weekly Leaderboard Prizes
        </h3>
        <p className="text-xs text-amber-700/80 mt-1">
          Top referrers earn massive Coin rewards every week! 1st: 5k, 2nd: 4k,
          3rd: 3k, 4th-20th: 500.
        </p>
      </div>
    </div>
  );
}

function LeaderboardList({
  leaders,
  loading,
}: {
  leaders: LeaderboardEntry[];
  loading: boolean;
}) {
  return (
    <div className="glass-panel p-2">
      {loading ? (
        <p className="text-xs text-slate-400 text-center py-8">
          Loading leaderboard...
        </p>
      ) : leaders.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-8">
          No qualified referrers yet.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {leaders.map((leader, index) => (
            <LeaderboardItem
              key={leader.telegram_id}
              leader={leader}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LeaderboardItem({
  leader,
  index,
}: {
  leader: LeaderboardEntry;
  index: number;
}) {
  const prize =
    index === 0
      ? 5000
      : index === 1
        ? 4000
        : index === 2
          ? 3000
          : index < 20
            ? 500
            : 0;

  const bgMap = ["bg-amber-50", "bg-slate-50", "bg-orange-50"];
  const colorMap = ["text-amber-700", "text-slate-700", "text-orange-800"];
  const rowBg = index < 3 ? bgMap[index] : "";
  const nameColor = index < 3 ? colorMap[index] : "text-slate-700";

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl ${rowBg}`}
    >
      <div className="flex items-center gap-3">
        <RankBadge index={index} />
        <div>
          <p className={`text-sm font-bold ${nameColor}`}>{leader.username}</p>
          {prize > 0 && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md">
                Win {prize} Coins
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="text-right flex flex-col items-end justify-center">
        <p className="text-lg font-bold text-slate-800 leading-none mb-1">
          {leader.qualified_count}
        </p>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider leading-none">
          Qualified
        </p>
      </div>
    </div>
  );
}

function RankBadge({ index }: { index: number }) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <span className="font-bold w-6 text-center text-lg">
      {index < 3 ? (
        medals[index]
      ) : (
        <span className="text-sm text-slate-400">{index + 1}</span>
      )}
    </span>
  );
}
