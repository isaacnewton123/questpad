import { useEffect, useState } from "react";
import {
  PiCheckCircle,
  PiXCircle,
} from "react-icons/pi";
import { apiFetch } from "../../../lib/api";
import { useUser } from "../../../context/useUser";
import type { AdminWithdrawal } from "../../../types/admin.types";

import { TxHashModal, RejectModal } from "./WithdrawalModals";

function WithdrawalCard({
  w,
  onReject,
  onComplete,
}: {
  w: AdminWithdrawal;
  onReject: (w: AdminWithdrawal) => void;
  onComplete: (w: AdminWithdrawal) => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">@{w.username}</h3>
          <p className="text-[10px] text-slate-400 font-mono break-all mt-1">
            {w.wallet_address}
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-blue-600">
            {w.amount_net.toFixed(3)}
          </span>
          <span className="text-xs text-slate-400 block -mt-1">TON</span>
        </div>
      </div>
      <ReferralBadge count={w.qualified_referrals} />
      <div className="flex gap-2">
        <button
          onClick={() => onReject(w)}
          className="flex-1 py-2 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-100 flex items-center justify-center gap-1 transition-colors"
        >
          <PiXCircle /> Reject
        </button>
        <button
          onClick={() => onComplete(w)}
          className="flex-1 py-2 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 flex items-center justify-center gap-1 transition-colors"
        >
          <PiCheckCircle /> Paid
        </button>
      </div>
    </div>
  );
}

function ReferralBadge({ count }: { count: number }) {
  return (
    <div className="bg-slate-50 p-2 rounded-lg flex justify-between items-center mb-3 border border-slate-100">
      <span className="text-xs text-slate-500">Qualified Referrals</span>
      <span
        className={`text-xs font-bold ${count >= 3 ? "text-emerald-600" : "text-red-500"}`}
      >
        {count}
      </span>
    </div>
  );
}

function useWithdrawals(user: NonNullable<ReturnType<typeof useUser>["user"]>) {
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeW, setActiveW] = useState<AdminWithdrawal | null>(null);
  const [rejectW, setRejectW] = useState<AdminWithdrawal | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await apiFetch<{ withdrawals: AdminWithdrawal[] }>(
        "/admin/withdrawals",
      );
      if (!cancelled && res.ok) setWithdrawals(res.data?.withdrawals ?? []);
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleComplete = async (id: string, txHash: string) => {
    const res = await apiFetch(`/admin/withdrawals/${id}/complete`, "POST", {
      tx_hash: txHash,
    });
    if (res.ok) {
      setWithdrawals((p) => p.filter((w) => w.id !== id));
      setActiveW(null);
    } else {
      alert("Failed to mark as paid.");
    }
  };

  const handleReject = async (id: string, reason: string) => {
    const res = await apiFetch(`/admin/withdrawals/${id}/reject`, "POST", {
      reason,
    });
    if (res.ok) {
      setWithdrawals((p) => p.filter((w) => w.id !== id));
      setRejectW(null);
    } else {
      alert("Failed to reject.");
    }
  };

  return { withdrawals, loading, activeW, setActiveW, rejectW, setRejectW, handleComplete, handleReject };
}

export function WithdrawalsTab({
  user,
}: {
  user: NonNullable<ReturnType<typeof useUser>["user"]>;
}) {
  const { withdrawals, loading, activeW, setActiveW, rejectW, setRejectW, handleComplete, handleReject } = useWithdrawals(user);

  if (loading)
    return <div className="text-center text-slate-500 py-10">Loading...</div>;
  if (withdrawals.length === 0)
    return (
      <div className="text-center text-slate-400 py-12">
        No pending withdrawals.
      </div>
    );

  return (
    <>
      <div className="space-y-4">
        {withdrawals.map((w) => (
          <WithdrawalCard
            key={w.id}
            w={w}
            onReject={setRejectW}
            onComplete={setActiveW}
          />
        ))}
      </div>
      {activeW && (
        <TxHashModal
          withdrawal={activeW}
          onSubmit={handleComplete}
          onClose={() => setActiveW(null)}
        />
      )}
      {rejectW && (
        <RejectModal
          withdrawal={rejectW}
          onSubmit={handleReject}
          onClose={() => setRejectW(null)}
        />
      )}
    </>
  );
}
