import { useState } from "react";
import { PiCheckCircleFill, PiXCircleFill } from "react-icons/pi";
import { apiFetch } from "../../../lib/api";
import type { Submission } from "../../../types/admin.types";

export function SubmissionList({
  subs,
  setSubs,
}: {
  subs: Submission[];
  setSubs: React.Dispatch<React.SetStateAction<Submission[]>>;
}) {
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
      {subs.map((s) => (
        <SubmissionCard
          key={s.id}
          sub={s}
          actionLoading={actionLoading}
          handleAction={handleAction}
        />
      ))}
    </div>
  );
}

export function SubmissionCard({
  sub,
  actionLoading,
  handleAction,
}: {
  sub: Submission;
  actionLoading: string | null;
  handleAction: (id: string, action: "approve" | "reject") => Promise<void>;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">{sub.questTitle}</h3>
          <p className="text-xs text-slate-500 mt-0.5">By @{sub.username}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">
            +{sub.rewardValue} {sub.rewardType}
          </p>
        </div>
      </div>
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4">
        <p className="text-slate-800 font-mono text-sm break-all">
          {sub.proof}
        </p>
      </div>
      <SubmissionActions
        id={sub.id}
        loading={actionLoading === sub.id}
        onAction={handleAction}
      />
    </div>
  );
}

function SubmissionActions({
  id,
  loading,
  onAction,
}: {
  id: string;
  loading: boolean;
  onAction: (id: string, action: "approve" | "reject") => Promise<void>;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onAction(id, "reject")}
        disabled={loading}
        className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-red-50 text-red-600 flex justify-center items-center"
      >
        <PiXCircleFill className="mr-1" />
        Reject
      </button>
      <button
        onClick={() => onAction(id, "approve")}
        disabled={loading}
        className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-emerald-50 text-emerald-600 flex justify-center items-center"
      >
        <PiCheckCircleFill className="mr-1" />
        Approve
      </button>
    </div>
  );
}
