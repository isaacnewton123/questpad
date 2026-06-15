import { useState } from "react";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { SiTon } from "react-icons/si";
import {
  PiCoinsFill, PiArrowSquareOut,
  PiUsers, PiCopy, PiCheck,
} from "react-icons/pi";
import { useUser } from "../context/useUser";
import { apiFetch } from "../lib/api";

export default function ProfileScreen() {
  const { user, refetchUser } = useUser();
  const wallet = useTonWallet();

  return (
    <div className="flex flex-col gap-4 pt-4 pb-nav px-4 max-w-md mx-auto">
      <div className="bg-animated" />

      <header className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gradient">Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          {user?.username ?? "Loading..."}
        </p>
      </header>

      <WalletSection wallet={wallet} />
      <BalanceSection user={user} refetchUser={refetchUser} />
      <ReferralSection telegramId={user?.telegram_id ?? null} />
    </div>
  );
}

function WalletSection({ wallet }: {
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

function BalanceSection({ user, refetchUser }: {
  user: ReturnType<typeof useUser>["user"];
  refetchUser: () => Promise<void>;
}) {
  const [withdrawing, setWithdrawing] = useState(false);
  const ton = Number(user?.ledger_ton ?? 0);
  const coins = user?.coins ?? 0;
  const canWithdraw = ton >= 0.1;

  async function handleWithdraw() {
    if (!canWithdraw || withdrawing) return;
    setWithdrawing(true);
    await apiFetch<WithdrawResponse>("/withdraw", "POST");
    setWithdrawing(false);
    refetchUser();
  }

  return (
    <div className="glass-panel p-5">
      <h2 className="text-sm font-bold text-slate-700 mb-3">Balance</h2>
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

      <button
        onClick={handleWithdraw}
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
    </div>
  );
}

function ReferralSection({ telegramId }: { telegramId: number | null }) {
  const [copied, setCopied] = useState(false);
  const botUsername = "QuestPadBot";
  const refLink = `https://t.me/${botUsername}?startapp=ref_${telegramId ?? ""}`;

  function handleCopy() {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass-panel p-5">
      <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
        <PiUsers size={16} />
        Referral Link
      </h2>
      <div className="flex gap-2">
        <input
          readOnly
          value={refLink}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl
            px-3 py-2 text-xs font-mono text-slate-600 truncate"
        />
        <button
          onClick={handleCopy}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs
            font-bold flex items-center gap-1.5 hover:bg-slate-700
            transition-colors"
        >
          {copied ? <PiCheck size={14} /> : <PiCopy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="text-[10px] text-slate-400 mt-2">
        Invite 3 friends to unlock withdrawals. Both you and your friend
        earn a bonus spin!
      </p>
    </div>
  );
}
