import { useState } from "react";
import { PiUsers, PiTrophy } from "react-icons/pi";
import MyProgressTab from "../components/referral/MyProgressTab";
import LeaderboardTab from "../components/referral/LeaderboardTab";

export default function ReferralsScreen() {
  const [activeTab, setActiveTab] = useState<"progress" | "leaderboard">("progress");

  return (
    <div className="flex flex-col gap-4 pt-4 pb-nav px-4 max-w-md mx-auto">
      <div className="bg-animated" />

      <header className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gradient">Referrals</h1>
        <p className="text-xs text-slate-500 mt-1">Invite friends & climb the ranks</p>
      </header>

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
