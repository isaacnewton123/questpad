import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { PiArrowLeft } from "react-icons/pi";
import { useUser } from "../context/useUser";
import { apiFetch } from "../lib/api";
import type { Submission } from "../types/admin.types";
import { SubmissionList } from "../components/admin/proof/SubmissionCard";

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
        setSubs(res.data.submissions.filter(s => s.campaignId === id));
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
