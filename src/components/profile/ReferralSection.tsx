import { Link } from "react-router-dom";
import { PiUsers } from "react-icons/pi";

export default function ReferralSection() {
  return (
    <div className="glass-panel p-5 bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100">
      <h2 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
        <PiUsers size={16} />
        Referrals & Leaderboard
      </h2>
      <p className="text-xs text-blue-800/80 mb-4">
        Invite friends to earn Bonus Spins, Coins, and TON. Check your progress
        and see how you rank on the global leaderboard!
      </p>
      <Link
        to="/referrals"
        className="bg-blue-500 text-white px-4 py-3 rounded-xl text-xs
          font-bold flex items-center justify-center gap-2 hover:bg-blue-600
          transition-colors shadow-sm shadow-blue-200 w-full"
      >
        View Progress & Invite
      </Link>
    </div>
  );
}
