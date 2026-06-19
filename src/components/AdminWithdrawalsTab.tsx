import { useEffect, useState } from "react";
import { PiCheckCircle, PiXCircle, PiX, PiPaperPlaneTilt } from "react-icons/pi";
import { apiFetch } from "../lib/api";
import { useUser } from "../context/useUser";
import type { AdminWithdrawal } from "../screens/AdminScreen";

function PaymentSummary({ w }: { w: AdminWithdrawal }) {
  return (
    <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
      <p><span className="text-slate-500">To:</span> <span className="font-mono font-bold text-slate-700 break-all">@{w.username}</span></p>
      <p><span className="text-slate-500">Wallet:</span> <span className="font-mono text-slate-600 break-all">{w.wallet_address}</span></p>
      <p><span className="text-slate-500">Amount:</span> <span className="font-bold text-blue-600">{w.amount_net.toFixed(3)} TON</span></p>
    </div>
  );
}

function ModalInput({ value, onChange, placeholder, label }: {
  value: string; onChange: (v: string) => void;
  placeholder: string; label: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600 block mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm
          font-mono focus:outline-none focus:ring-2 focus:ring-blue-300
          placeholder:text-slate-300"
      />
    </div>
  );
}

function ModalShell({ title, onClose, children }: {
  title: string; onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-60 flex items-end justify-center p-4 pb-10">
      <div className="bg-white w-full max-w-md rounded-2xl p-5 space-y-4 animate-slide-up">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <PiX size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TxHashModal({ withdrawal, onSubmit, onClose }: {
  withdrawal: AdminWithdrawal;
  onSubmit: (id: string, txHash: string) => void;
  onClose: () => void;
}) {
  const [txHash, setTxHash] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!txHash.trim()) return;
    setSubmitting(true);
    await onSubmit(withdrawal.id, txHash.trim());
    setSubmitting(false);
  }

  return (
    <ModalShell title="Confirm Payment" onClose={onClose}>
      <PaymentSummary w={withdrawal} />
      <ModalInput value={txHash} onChange={setTxHash} label="Transaction Hash / Signature" placeholder="Paste tx hash here..." />
      <button
        onClick={handleSubmit}
        disabled={!txHash.trim() || submitting}
        className="w-full py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl
          hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2 transition-colors"
      >
        <PiPaperPlaneTilt />
        {submitting ? "Submitting..." : "Mark as Paid"}
      </button>
    </ModalShell>
  );
}

function RejectModal({ withdrawal, onSubmit, onClose }: {
  withdrawal: AdminWithdrawal;
  onSubmit: (id: string, reason: string) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!reason.trim()) return;
    setSubmitting(true);
    await onSubmit(withdrawal.id, reason.trim());
    setSubmitting(false);
  }

  return (
    <ModalShell title="Reject Withdrawal" onClose={onClose}>
      <PaymentSummary w={withdrawal} />
      <ModalInput value={reason} onChange={setReason} label="Rejection Reason" placeholder="Enter reason for rejection..." />
      <button
        onClick={handleSubmit}
        disabled={!reason.trim() || submitting}
        className="w-full py-3 bg-red-500 text-white font-bold text-sm rounded-xl
          hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2 transition-colors"
      >
        <PiXCircle />
        {submitting ? "Rejecting..." : "Reject & Refund"}
      </button>
    </ModalShell>
  );
}

function WithdrawalCard({ w, onReject, onComplete }: {
  w: AdminWithdrawal;
  onReject: (w: AdminWithdrawal) => void;
  onComplete: (w: AdminWithdrawal) => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">@{w.username}</h3>
          <p className="text-[10px] text-slate-400 font-mono break-all mt-1">{w.wallet_address}</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-blue-600">{w.amount_net.toFixed(3)}</span>
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
      <span className={`text-xs font-bold ${count >= 3 ? "text-emerald-600" : "text-red-500"}`}>
        {count}
      </span>
    </div>
  );
}

export function WithdrawalsTab({ user }: { user: NonNullable<ReturnType<typeof useUser>["user"]> }) {
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeW, setActiveW] = useState<AdminWithdrawal | null>(null);
  const [rejectW, setRejectW] = useState<AdminWithdrawal | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await apiFetch<{ withdrawals: AdminWithdrawal[] }>("/admin/withdrawals");
      if (!cancelled && res.ok) setWithdrawals(res.data?.withdrawals ?? []);
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [user]);

  const handleComplete = async (id: string, txHash: string) => {
    const res = await apiFetch(`/admin/withdrawals/${id}/complete`, "POST", { tx_hash: txHash });
    if (res.ok) {
      setWithdrawals((p) => p.filter((w) => w.id !== id));
      setActiveW(null);
    } else {
      alert("Failed to mark as paid.");
    }
  };

  const handleReject = async (id: string, reason: string) => {
    const res = await apiFetch(`/admin/withdrawals/${id}/reject`, "POST", { reason });
    if (res.ok) {
      setWithdrawals((p) => p.filter((w) => w.id !== id));
      setRejectW(null);
    } else {
      alert("Failed to reject.");
    }
  };

  if (loading) return <div className="text-center text-slate-500 py-10">Loading...</div>;
  if (withdrawals.length === 0) return <div className="text-center text-slate-400 py-12">No pending withdrawals.</div>;

  return (
    <>
      <div className="space-y-4">
        {withdrawals.map((w) => (
          <WithdrawalCard key={w.id} w={w} onReject={setRejectW} onComplete={setActiveW} />
        ))}
      </div>
      {activeW && <TxHashModal withdrawal={activeW} onSubmit={handleComplete} onClose={() => setActiveW(null)} />}
      {rejectW && <RejectModal withdrawal={rejectW} onSubmit={handleReject} onClose={() => setRejectW(null)} />}
    </>
  );
}
