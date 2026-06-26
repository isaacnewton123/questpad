import type { LeaderboardEntry } from '../../types/tree';
import { PiTrophyFill, PiUserCircleFill } from 'react-icons/pi';
import { SiTon } from 'react-icons/si';

export function LeaderboardTab({ leaderboard, profileId, seasonEnd }: { leaderboard: LeaderboardEntry[], profileId: number, seasonEnd?: string | null }) {
  const daysLeft = seasonEnd ? Math.max(0, Math.ceil((new Date(seasonEnd).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : 30;

  return (
    <div className="h-full flex flex-col">
      <div className="text-center z-10 pt-4 pb-2">
        <h2 className="text-xl font-bold text-gradient flex justify-center items-center gap-2"><PiTrophyFill className="text-amber-500" /> Leaderboard</h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <p className="text-[11px] text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200 font-medium flex items-center">
            Prize Pool: <span className="font-bold text-amber-500 ml-1 flex items-center gap-1">3 <SiTon className="text-blue-500" /></span>
          </p>
          <div className="text-[11px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100 font-bold">
            {daysLeft} Days Left
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar">
        <LeaderboardList leaderboard={leaderboard} profileId={profileId} />
      </div>
    </div>
  );
}

function LeaderboardList({ leaderboard, profileId }: { leaderboard: LeaderboardEntry[], profileId: number }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mt-2">
      {leaderboard.map((user, idx) => {
        const rank = idx + 1;
        let rankDisplay = `#${rank}`;
        let prize: string | null = null;
        if (rank === 1) { rankDisplay = '🥇'; prize = '1.5'; }
        else if (rank === 2) { rankDisplay = '🥈'; prize = '1.0'; }
        else if (rank === 3) { rankDisplay = '🥉'; prize = '0.5'; }

        return (
          <div key={user.telegram_id} className={`flex items-center p-3 border-b border-slate-100 ${user.telegram_id === profileId ? 'bg-blue-50/50' : ''}`}>
            <div className={`w-10 text-center font-bold text-[14px] ${user.telegram_id === profileId ? 'text-blue-600' : 'text-slate-500'}`}>{rankDisplay}</div>
            {user.telegram_id === profileId && (
              <div className="w-8 h-8 bg-blue-100 rounded-full ml-2 mr-3 flex items-center justify-center text-sm border border-blue-200">
                <PiUserCircleFill className="text-blue-500 text-xl" />
              </div>
            )}
            <div className="flex-1 ml-2">
              <h4 className="font-bold text-slate-800 text-[13px]">{user.username} {user.telegram_id === profileId ? '(You)' : ''}</h4>
              {prize && (
                <div className="text-[10px] text-amber-700 font-bold bg-amber-100 inline-flex items-center px-1.5 py-0.5 rounded mt-0.5">
                  {prize} <SiTon className="text-blue-500 ml-1" />
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="font-bold text-blue-500 text-[13px]">Lvl {user.tree_level}</div>
              <div className="text-[11px] text-slate-400">{user.tree_water} Drops</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
