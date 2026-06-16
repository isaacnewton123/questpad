import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { PiArrowLeft, PiTicket, PiListChecks, PiWallet } from "react-icons/pi";
import { useUser } from "../context/useUser";
import { apiFetch } from "../lib/api";
import { WithdrawalsTab } from "../components/AdminWithdrawalsTab";

export interface Submission {
  id: string;
  userId: number;
  username: string;
  questTitle: string;
  proof: string;
  rewardType: string;
  rewardValue: number;
  campaignId: string;
  campaignTitle?: string;
}
export interface AdminCampaign {
  id: string;
  title: string;
  campaign_type: string;
  current_completions: number;
  max_completions: number | null;
  is_drawn: boolean;
  expires_at: string | null;
}
export interface AdminWithdrawal {
  id: string;
  amount_net: number;
  created_at: string;
  username: string;
  wallet_address: string;
  qualified_referrals: number;
}

export default function AdminScreen() {
  const { user } = useUser();
  const [tab, setTab] = useState<"proofs" | "campaigns" | "withdrawals">("proofs");
  if (!user?.is_admin) return <Navigate to="/" replace />;
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <AdminHeader />
      <div className="max-w-md mx-auto p-4 space-y-4 mt-2">
        {tab === "proofs" ? (
          <ProofsTab user={user} />
        ) : tab === "withdrawals" ? (
          <WithdrawalsTab user={user} />
        ) : (
          <CampaignsTab user={user} />
        )}
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 glass-panel"
        style={{
          borderRadius: "24px 24px 0 0",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex items-center justify-around h-14 max-w-md mx-auto">
          {[
            { id: "proofs", icon: PiListChecks, label: "Proofs" },
            { id: "withdrawals", icon: PiWallet, label: "Payouts" },
            { id: "campaigns", icon: PiTicket, label: "Raffles" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as "proofs" | "withdrawals" | "campaigns")}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 transition-all duration-200 ${
                tab === item.id
                  ? "text-blue-500 scale-105"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <item.icon size={20} />
              <span className="text-[9px] font-semibold tracking-wide">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function AdminHeader() {
  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30 shadow-sm">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="p-2 -ml-2 text-slate-400"
          >
            <PiArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
        </div>
      </div>
    </div>
  );
}

function ProofsTab({ user }: { user: NonNullable<ReturnType<typeof useUser>["user"]> }) {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await apiFetch<{ submissions: Submission[] }>("/admin/submissions");
      if (!cancelled && res.ok) setSubs(res.data?.submissions ?? []);
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [user]);

  if (loading) return <div className="text-center text-slate-500 py-10">Loading...</div>;
  if (subs.length === 0) return <div className="text-center text-slate-400 py-12">All caught up!</div>;

  const groups = groupSubmissions(subs);

  return (
    <div className="space-y-3">
      {groups.map((g) => <ProofGroupCard key={g.id} g={g} />)}
    </div>
  );
}

function groupSubmissions(subs: Submission[]) {
  return Object.values(
    subs.reduce((acc, sub) => {
      const cid = sub.campaignId;
      if (!acc[cid]) {
        acc[cid] = { id: cid, title: sub.campaignTitle || "Official Tasks", count: 0 };
      }
      acc[cid].count++;
      return acc;
    }, {} as Record<string, { id: string; title: string; count: number }>)
  );
}

function ProofGroupCard({ g }: { g: { id: string; title: string; count: number } }) {
  return (
    <Link
      to={`/admin/approve/${g.id}`}
      className="block bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:border-blue-300 transition-colors"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-sm">{g.title}</h3>
        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
          {g.count} pending
        </span>
      </div>
    </Link>
  );
}

function CampaignsTab({
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
        <CampaignCard
          key={c.id}
          camp={c}
          drawing={drawing}
          handleDraw={handleDraw}
        />
      ))}
    </>
  );
}

function CampaignCard({
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


