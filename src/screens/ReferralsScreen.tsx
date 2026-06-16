import { useState, useEffect } from "react";
import { useUser } from "../context/useUser";
import { apiFetch } from "../lib/api";
import { 
  PiUsers, PiTrophy, PiCopy, PiCheck, 
  PiCheckCircleFill, PiClockCountdownFill 
} from "react-icons/pi";

interface Friend {
  username: string;
  is_qualified: boolean;
  joined_at: string;
}

interface LeaderboardEntry {
  telegram_id: number;
  username: string;
  qualified_count: number;
}

export default function ReferralsScreen() {
  const [activeTab, setActiveTab] = useState<"progress" | "leaderboard">("progress");

  return (
    <div className="flex flex-col gap-4 pt-4 pb-nav px-4 max-w-md mx-auto">
      <div className="bg-animated" />
      
      <header className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gradient">Referrals</h1>
        <p className="text-xs text-slate-500 mt-1">Invite friends & climb the ranks</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-2">
        <button
          onClick={() => setActiveTab("progress")}
          className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "progress" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <PiUsers size={18} /> My Progress
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "leaderboard" ? "bg-white text-amber-500 shadow-sm" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <PiTrophy size={18} /> Leaderboard
        </button>
      </div>

      {activeTab === "progress" ? <MyProgressTab /> : <LeaderboardTab />}
    </div>
  );
}

function MyProgressTab() {
  const { user } = useUser();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [total, setTotal] = useState(0);
  const [qualified, setQualified] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ totalCount: number; qualifiedCount: number; friends: Friend[] }>("/user/referrals")
      .then(({ data }) => {
        setTotal(data.totalCount || 0);
        setQualified(data.qualifiedCount || 0);
        setFriends(data.friends || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <InviteLinkSection telegramId={user?.telegram_id ?? null} />
      <ProgressTierBar qualified={qualified} />
      <FriendsList total={total} friends={friends} loading={loading} />
    </div>
  );
}

function ProgressTierBar({ qualified }: { qualified: number }) {
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

function FriendsList({ total, friends, loading }: { total: number, friends: Friend[], loading: boolean }) {
  return (
    <div className="glass-panel p-5">
      <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center justify-between">
        <span>Invited Friends</span>
        <span className="text-xs font-normal text-slate-500">{total} Total</span>
      </h2>
      {loading ? (
        <p className="text-xs text-slate-400 text-center py-4">Loading friends...</p>
      ) : friends.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">You haven't invited anyone yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {friends.map((f, i) => (
            <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
              <div>
                <p className="text-sm font-bold text-slate-700">{f.username}</p>
                <p className="text-[10px] text-slate-400">
                  Joined {new Date(f.joined_at).toLocaleDateString()}
                </p>
              </div>
              {f.is_qualified ? (
                <div className="flex items-center gap-1 text-emerald-500">
                  <PiCheckCircleFill size={16} />
                  <span className="text-xs font-bold">Qualified</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-slate-400">
                  <PiClockCountdownFill size={16} />
                  <span className="text-xs font-bold">Pending</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InviteLinkSection({ telegramId }: { telegramId: number | null }) {
  const [copied, setCopied] = useState(false);
  const botUsername = "QuestPadBot"; // Update this with actual bot username
  const refLink = `https://t.me/${botUsername}?startapp=ref_${telegramId ?? ""}`;

  function handleCopy() {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass-panel p-5 bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100">
      <h2 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
        <PiUsers size={16} />
        Your Invite Link
      </h2>
      <div className="flex gap-2">
        <input
          readOnly
          value={refLink}
          className="flex-1 bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 truncate"
        />
        <button
          onClick={handleCopy}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200"
        >
          {copied ? <PiCheck size={14} /> : <PiCopy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="text-[10px] text-blue-600/70 mt-2">
        Friends must complete the Official Quests & connect a wallet to qualify.
      </p>
    </div>
  );
}

function LeaderboardTab() {
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
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 items-start">
        <PiTrophy className="text-amber-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="text-sm font-bold text-amber-900">Weekly Leaderboard Prizes</h3>
          <p className="text-xs text-amber-700/80 mt-1">
            Top referrers earn massive Coin rewards every week! 1st: 5k, 2nd: 4k, 3rd: 3k, 4th-20th: 500.
          </p>
        </div>
      </div>
      <LeaderboardList leaders={leaders} loading={loading} />
    </div>
  );
}

function LeaderboardList({ leaders, loading }: { leaders: LeaderboardEntry[], loading: boolean }) {
  return (
    <div className="glass-panel p-2">
      {loading ? (
        <p className="text-xs text-slate-400 text-center py-8">Loading leaderboard...</p>
      ) : leaders.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-8">No qualified referrers yet.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {leaders.map((leader, index) => (
            <LeaderboardItem key={leader.telegram_id} leader={leader} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function LeaderboardItem({ leader, index }: { leader: LeaderboardEntry, index: number }) {
  const prize = index === 0 ? 5000 : index === 1 ? 4000 : index === 2 ? 3000 : index < 20 ? 500 : 0;

  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-xl ${
        index === 0 ? "bg-amber-50" :
        index === 1 ? "bg-slate-50" :
        index === 2 ? "bg-orange-50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="font-bold w-6 text-center text-lg">
          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : <span className="text-sm text-slate-400">{index + 1}</span>}
        </span>
        <div>
          <p className={`text-sm font-bold ${
            index === 0 ? "text-amber-700" :
            index === 1 ? "text-slate-700" :
            index === 2 ? "text-orange-800" : "text-slate-700"
          }`}>
            {leader.username}
          </p>
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
        <p className="text-lg font-bold text-slate-800 leading-none mb-1">{leader.qualified_count}</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider leading-none">Qualified</p>
      </div>
    </div>
  );
}
