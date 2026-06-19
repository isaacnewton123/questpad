import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../../lib/api";
import { useUser } from "../../../context/useUser";
import type { Submission } from "../../../types/admin.types";

export default function AdminProofsTab({
  user,
}: {
  user: NonNullable<ReturnType<typeof useUser>["user"]>;
}) {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await apiFetch<{ submissions: Submission[] }>(
        "/admin/submissions",
      );
      if (!cancelled && res.ok) setSubs(res.data?.submissions ?? []);
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading)
    return <div className="text-center text-slate-500 py-10">Loading...</div>;
  if (subs.length === 0)
    return (
      <div className="text-center text-slate-400 py-12">All caught up!</div>
    );

  const groups = groupSubmissions(subs);

  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <ProofGroupCard key={g.id} g={g} />
      ))}
    </div>
  );
}

function groupSubmissions(subs: Submission[]) {
  return Object.values(
    subs.reduce(
      (acc, sub) => {
        const cid = sub.campaignId;
        if (!acc[cid]) {
          acc[cid] = {
            id: cid,
            title: sub.campaignTitle || "Official Tasks",
            count: 0,
          };
        }
        acc[cid].count++;
        return acc;
      },
      {} as Record<string, { id: string; title: string; count: number }>,
    ),
  );
}

function ProofGroupCard({
  g,
}: {
  g: { id: string; title: string; count: number };
}) {
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
