import { useEffect, useState } from "react";
import { PiCheckCircle, PiXCircle } from "react-icons/pi";
import { apiFetch } from "../../../lib/api";

interface HistoryItem {
  id: string;
  amount_net: number;
  status: string;
  tx_hash: string | null;
  reject_reason: string | null;
  created_at: string;
  username: string;
  wallet_address: string;
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "confirmed"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-red-50 text-red-600";
  const Icon = status === "confirmed" ? PiCheckCircle : PiXCircle;
  const label = status === "confirmed" ? "Paid" : "Rejected";

  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${styles}`}
    >
      <Icon size={12} /> {label}
    </span>
  );
}

function HistoryCard({ item }: { item: HistoryItem }) {
  const date = new Date(item.created_at).toLocaleDateString();

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">@{item.username}</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">{date}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-bold text-blue-600">
            {item.amount_net.toFixed(3)} TON
          </span>
          <StatusBadge status={item.status} />
        </div>
      </div>
      {item.tx_hash && (
        <div className="bg-slate-50 p-2 rounded-lg mt-2 border border-slate-100">
          <p className="text-[10px] text-slate-500">Tx Hash</p>
          <p className="text-[10px] font-mono text-slate-600 break-all">
            {item.tx_hash}
          </p>
        </div>
      )}
      {item.reject_reason && (
        <div className="bg-red-50 p-2 rounded-lg mt-2 border border-red-100">
          <p className="text-[10px] text-red-500">Reason</p>
          <p className="text-[10px] text-red-700">{item.reject_reason}</p>
        </div>
      )}
    </div>
  );
}

export function AdminHistoryTab() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await apiFetch<{ history: HistoryItem[] }>(
        "/admin/withdrawals/history",
      );
      if (!cancelled && res.ok) setHistory(res.data?.history ?? []);
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading)
    return <div className="text-center text-slate-500 py-10">Loading...</div>;
  if (history.length === 0)
    return (
      <div className="text-center text-slate-400 py-12">No history yet.</div>
    );

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <HistoryCard key={item.id} item={item} />
      ))}
    </div>
  );
}
