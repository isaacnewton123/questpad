import { useState, useEffect } from "react";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { SiTon } from "react-icons/si";
import { Link } from "react-router-dom";
import {
  PiUserCircle,
  PiArrowSquareOut,
  PiCoinsFill,
  PiUsers,
  PiXCircle,
  PiShieldCheckFill,
} from "react-icons/pi";
import { useUser } from "../context/useUser";
import { apiFetch } from "../lib/api";

export default function ProfileScreen() {
  const { user, refetchUser } = useUser();
  const wallet = useTonWallet();

  useEffect(() => {
    if (wallet?.account.address) {
      apiFetch("/user/wallet", "POST", {
        wallet_address: wallet.account.address,
      })
        .then(() => refetchUser())
        .catch(console.error);
    }
  }, [wallet?.account.address, refetchUser]);

  return (
    <div className="flex flex-col gap-4 pt-4 pb-nav px-4 max-w-md mx-auto">
      <div className="bg-animated" />

      <header className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gradient flex items-center justify-center gap-2">
          <PiUserCircle /> Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {user?.username ?? "Loading..."}
        </p>
      </header>

      {user?.is_admin && (
        <Link
          to="/admin"
          className="bg-emerald-50 text-emerald-600 rounded-xl p-3 flex items-center justify-between shadow-sm border border-emerald-100 hover:bg-emerald-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <PiShieldCheckFill size={20} />
            <span className="font-bold text-sm">Admin Dashboard</span>
          </div>
          <span className="text-xs font-semibold bg-white px-2 py-1 rounded-md shadow-sm">
            Review Proofs →
          </span>
        </Link>
      )}

      <WalletSection wallet={wallet} />
      <BalanceSection user={user} refetchUser={refetchUser} />
      <ReferralSection />
    </div>
  );
}

function WalletSection({
  wallet,
}: {
  wallet: ReturnType<typeof useTonWallet>;
}) {
  return (
    <div className="glass-panel p-5">
      <h2 className="text-sm font-bold text-slate-700 mb-3">TON Wallet</h2>
      {wallet ? (
        <div className="flex items-center gap-2 text-sm">
          <SiTon className="text-blue-500" size={16} />
          <span className="text-slate-600 font-mono text-xs truncate">
            {wallet.account.address.slice(0, 8)}...
            {wallet.account.address.slice(-6)}
          </span>
          <span className="text-emerald-500 text-xs font-semibold">
            Connected
          </span>
        </div>
      ) : (
        <TonConnectButton />
      )}
    </div>
  );
}

interface WithdrawResponse {
  withdrawal_id?: string;
  amount_net?: number;
  error?: string;
}

function ReferralModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full"
        >
          <PiXCircle size={20} />
        </button>

        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <PiUsers size={32} className="text-blue-600" />
        </div>

        <h3 className="text-xl font-black text-slate-800 text-center mb-2">
          Referrals Required
        </h3>

        <p className="text-sm text-slate-500 text-center mb-6 px-2">
          To withdraw your TON, you need to invite at least 3 friends who
          complete a quest.
        </p>

        <Link
          to="/referrals"
          className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          Go to Invite Page
        </Link>
      </div>
    </div>
  );
}

function BalanceDisplay({ ton, coins }: { ton: number; coins: number }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <SiTon className="text-blue-500" size={18} />
        <span className="text-2xl font-bold text-slate-800">
          {ton.toFixed(3)}
        </span>
        <span className="text-sm text-slate-400">TON</span>
      </div>
      <div className="flex items-center gap-1.5">
        <PiCoinsFill className="text-amber-500" size={16} />
        <span className="font-bold text-slate-800">{coins}</span>
        <span className="text-xs text-slate-400">Coins</span>
      </div>
    </div>
  );
}

function WithdrawalButton({
  canWithdraw,
  withdrawing,
  ton,
  onWithdraw,
}: {
  canWithdraw: boolean;
  withdrawing: boolean;
  ton: number;
  onWithdraw: () => void;
}) {
  return (
    <>
      <button
        onClick={onWithdraw}
        disabled={!canWithdraw || withdrawing}
        className={`w-full text-sm font-bold py-3 rounded-2xl flex
          items-center justify-center gap-2 transition-all ${
            canWithdraw
              ? "bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98]"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
      >
        <PiArrowSquareOut size={16} />
        {withdrawing ? "Processing..." : `Withdraw (min 0.1 TON)`}
      </button>
      {!canWithdraw && (
        <p className="text-[10px] text-slate-400 text-center mt-2">
          Earn {(0.1 - ton).toFixed(3)} more TON to unlock withdrawal
        </p>
      )}
    </>
  );
}

function BalanceSection({
  user,
  refetchUser,
}: {
  user: ReturnType<typeof useUser>["user"];
  refetchUser: () => Promise<void>;
}) {
  const [withdrawing, setWithdrawing] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  const ton = Number(user?.ledger_ton ?? 0);
  const coins = user?.coins ?? 0;
  const canWithdraw = ton >= 0.1;

  async function handleWithdraw() {
    if (!canWithdraw || withdrawing) return;
    setWithdrawing(true);
    const res = await apiFetch<WithdrawResponse>("/withdraw", "POST");
    setWithdrawing(false);

    if (!res.ok && res.data?.error?.includes("Need 3 qualified referrals")) {
      setShowReferralModal(true);
      return;
    } else if (!res.ok) {
      alert(res.data?.error || "Withdrawal failed");
      return;
    }

    alert("Withdrawal queued successfully!");
    refetchUser();
  }

  return (
    <div className="glass-panel p-5 relative">
      <h2 className="text-sm font-bold text-slate-700 mb-3">Balance</h2>

      <BalanceDisplay ton={ton} coins={coins} />

      <WithdrawalButton
        canWithdraw={canWithdraw}
        withdrawing={withdrawing}
        ton={ton}
        onWithdraw={handleWithdraw}
      />

      {/* Referral Modal */}
      {showReferralModal && (
        <ReferralModal onClose={() => setShowReferralModal(false)} />
      )}
    </div>
  );
}

function ReferralSection() {
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
