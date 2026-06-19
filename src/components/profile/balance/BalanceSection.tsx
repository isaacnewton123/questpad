import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../../context/useUser";
import { apiFetch } from "../../../lib/api";
import BalanceDisplay from "./BalanceDisplay";
import WithdrawalButton from "./WithdrawalButton";
import ReferralModal from "../ReferralModal";

interface WithdrawResponse {
  withdrawal_id?: string;
  amount_net?: number;
  error?: string;
}

export default function BalanceSection({
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
      <Link
        to="/withdrawals"
        className="block text-center text-xs font-semibold text-blue-500 mt-3 hover:text-blue-600 transition-colors"
      >
        View Withdrawal History →
      </Link>
      {showReferralModal && (
        <ReferralModal onClose={() => setShowReferralModal(false)} />
      )}
    </div>
  );
}
