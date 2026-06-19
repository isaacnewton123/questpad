import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PiArrowLeft, PiCheckCircle, PiXCircle,
  PiClockCountdown, PiReceipt,
} from "react-icons/pi";
import { apiFetch } from "../lib/api";

interface Withdrawal {
  id: string;
  amount_net: number;
  status: string;
  tx_hash: string | null;
  reject_reason: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; style: string; Icon: typeof PiCheckCircle }> = {
  queued: { label: "Pending", style: "bg-amber-50 text-amber-600", Icon: PiClockCountdown },
  confirmed: { label: "Approved", style: "bg-emerald-50 text-emerald-600", Icon: PiCheckCircle },
  rejected: { label: "Rejected", style: "bg-red-50 text-red-600", Icon: PiXCircle },
  failed: { label: "Failed", style: "bg-red-50 text-red-600", Icon: PiXCircle },
};

function WithdrawalStatus({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.queued;
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${cfg.style}`}>
      <cfg.Icon size={12} /> {cfg.label}
    </span>
  );
}

function WithdrawalItem({ w }: { w: Withdrawal }) {
  const date = new Date(w.created_at).toLocaleDateString();

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-1">
        <div>
          <span className="text-sm font-bold text-slate-800">
            {Number(w.amount_net).toFixed(3)} TON
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5">{date}</p>
        </div>
        <WithdrawalStatus status={w.status} />
      </div>
      {w.tx_hash && <TxHashBox hash={w.tx_hash} />}
      {w.reject_reason && <RejectReasonBox reason={w.reject_reason} />}
    </div>
  );
}

function TxHashBox({ hash }: { hash: string }) {
  return (
    <div className="bg-emerald-50 p-2 rounded-lg mt-2 border border-emerald-100">
      <p className="text-[10px] text-emerald-600 font-semibold">Tx Hash</p>
      <p className="text-[10px] font-mono text-emerald-700 break-all">{hash}</p>
    </div>
  );
}

function RejectReasonBox({ reason }: { reason: string }) {
  return (
    <div className="bg-red-50 p-2 rounded-lg mt-2 border border-red-100">
      <p className="text-[10px] text-red-500 font-semibold">Rejection Reason</p>
      <p className="text-[10px] text-red-700">{reason}</p>
    </div>
  );
}

export default function WithdrawalHistoryScreen() {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await apiFetch<{ withdrawals: Withdrawal[] }>("/user/withdrawals");
      if (!cancelled && res.ok) setWithdrawals(res.data?.withdrawals ?? []);
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="pb-nav max-w-md mx-auto">
      <div className="bg-animated" />
      <div className="px-4 pt-4">
        <button
          onClick={() => navigate("/profile")}
          className="text-sm text-slate-500 font-semibold mb-3 flex items-center gap-1
            active:scale-95 transition-transform"
        >
          <PiArrowLeft /> Back
        </button>
        <h1 className="text-xl font-bold text-gradient flex items-center gap-2 mb-4">
          <PiReceipt /> Withdrawal History
        </h1>
      </div>
      <div className="px-4 space-y-3">
        {loading && <div className="text-center text-slate-500 py-10">Loading...</div>}
        {!loading && withdrawals.length === 0 && (
          <div className="text-center text-slate-400 py-12">No withdrawals yet.</div>
        )}
        {withdrawals.map((w) => (
          <WithdrawalItem key={w.id} w={w} />
        ))}
      </div>
    </div>
  );
}
