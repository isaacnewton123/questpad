import { useEffect, useState } from "react";
import { PiTicket } from "react-icons/pi";
import { apiFetch } from "../../../lib/api";
import { useUser } from "../../../context/useUser";
import type { AdminCampaign } from "../../../types/admin.types";

export default function AdminCampaignsTab({
  user,
}: {
  user: NonNullable<ReturnType<typeof useUser>["user"]>;
}) {
  const [camps, setCamps] = useState<AdminCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await apiFetch<{ campaigns: AdminCampaign[] }>(
        "/admin/campaigns",
      );
      if (!cancelled && res.ok) setCamps(res.data?.campaigns ?? []);
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading)
    return <div className="text-center text-slate-500 py-10">Loading...</div>;
  if (camps.length === 0)
    return (
      <div className="text-center text-slate-400 py-12">No raffles found.</div>
    );

  return (
    <div className="space-y-4">
      <CampaignList camps={camps} setCamps={setCamps} />
    </div>
  );
}

function CampaignList({
  camps,
  setCamps,
}: {
  camps: AdminCampaign[];
  setCamps: React.Dispatch<React.SetStateAction<AdminCampaign[]>>;
}) {
  const [drawing, setDrawing] = useState<string | null>(null);

  const handleDraw = async (id: string) => {
    if (!confirm("Are you sure you want to draw this raffle now?")) return;
    setDrawing(id);
    const res = await apiFetch<{ winnersCount: number }>(
      `/admin/campaigns/${id}/draw`,
      "POST",
    );
    if (res.ok) {
      alert(`Raffle drawn! ${res.data?.winnersCount} winners selected.`);
      setCamps((p: AdminCampaign[]) =>
        p.map((c) => (c.id === id ? { ...c, is_drawn: true } : c)),
      );
    } else {
      alert("Failed to draw raffle");
    }
    setDrawing(null);
  };

  return (
    <>
      {camps.map((c) => (
        <AdminRaffleCard
          key={c.id}
          camp={c}
          drawing={drawing}
          handleDraw={handleDraw}
        />
      ))}
    </>
  );
}

function AdminRaffleCard({
  camp,
  drawing,
  handleDraw,
}: {
  camp: AdminCampaign;
  drawing: string | null;
  handleDraw: (id: string) => Promise<void>;
}) {
  const isExpired = !camp.expires_at || new Date(camp.expires_at) <= new Date();
  const isDisabled = camp.is_drawn || drawing === camp.id || !isExpired;

  let btnText = "Draw Winners";
  if (camp.is_drawn) btnText = "Raffle Completed";
  else if (drawing === camp.id) btnText = "Drawing...";
  else if (!isExpired) btnText = "Waiting for expiration";

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="mb-3">
        <h3 className="font-bold text-slate-800 text-sm">{camp.title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Entries: {camp.current_completions}
        </p>
      </div>
      <button
        onClick={() => handleDraw(camp.id)}
        disabled={isDisabled}
        className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-colors ${isDisabled ? "bg-slate-100 text-slate-400" : "bg-blue-500 text-white hover:bg-blue-600"}`}
      >
        <PiTicket size={18} />
        {btnText}
      </button>
    </div>
  );
}
