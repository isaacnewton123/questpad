import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { PiCheckCircleFill, PiXCircleFill, PiArrowLeft } from "react-icons/pi";
import { useUser } from "../context/useUser";
import { apiFetch } from "../lib/api";
import type { Submission } from "./AdminScreen";

export default function AdminApproveScreen() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.is_admin || !id) return;
    let cancelled = false;
    async function load() {
      const res = await apiFetch<{ submissions: Submission[] }>("/admin/submissions");
      if (!cancelled && res.ok && res.data?.submissions) {
        // Filter submissions by campaign ID (or 'official')
        const filtered = res.data.submissions.filter(s => s.campaignId === id);
        setSubs(filtered);
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [user, id]);

  if (!user?.is_admin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400">
              <PiArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Approve Proofs</h1>
          </div>
        </div>
      </div>
      <div className="max-w-md mx-auto p-4 mt-2">
        {loading ? (
          <div className="text-center text-slate-500 py-10">Loading...</div>
        ) : subs.length === 0 ? (
          <div className="text-center text-slate-400 py-12">All caught up!</div>
        ) : (
          <SubmissionList subs={subs} setSubs={setSubs} />
        )}
      </div>
    </div>
  );
}

function SubmissionList({ subs, setSubs }: { subs: Submission[]; setSubs: React.Dispatch<React.SetStateAction<Submission[]>> }) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    const res = await apiFetch(`/admin/submissions/${id}/${action}`, "POST");
    if (res.ok) setSubs((p: Submission[]) => p.filter((s) => s.id !== id));
    else alert(`Failed to ${action}`);
    setActionLoading(null);
  };

  return (
    <div className="space-y-3">
      {subs.map(s => <SubmissionCard key={s.id} sub={s} actionLoading={actionLoading} handleAction={handleAction} />)}
    </div>
  );
}

function SubmissionCard({ sub, actionLoading, handleAction }: { sub: Submission; actionLoading: string | null; handleAction: (id: string, action: "approve" | "reject") => Promise<void> }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">{sub.questTitle}</h3>
          <p className="text-xs text-slate-500 mt-0.5">By @{sub.username}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">+{sub.rewardValue} {sub.rewardType}</p>
        </div>
      </div>
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4">
        <p className="text-slate-800 font-mono text-sm break-all">{sub.proof}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => handleAction(sub.id, "reject")} disabled={actionLoading === sub.id} className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-red-50 text-red-600 flex justify-center items-center"><PiXCircleFill className="mr-1"/>Reject</button>
        <button onClick={() => handleAction(sub.id, "approve")} disabled={actionLoading === sub.id} className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-emerald-50 text-emerald-600 flex justify-center items-center"><PiCheckCircleFill className="mr-1"/>Approve</button>
      </div>
    </div>
  );
}
