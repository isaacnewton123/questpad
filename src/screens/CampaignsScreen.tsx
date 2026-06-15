import { useState, useEffect } from "react";
import { PiRocketLaunch } from "react-icons/pi";
import CampaignCard, { type CampaignData } from "../components/CampaignCard";
import { apiFetch } from "../lib/api";

interface CampaignsResponse {
  campaigns: CampaignData[];
}

export default function CampaignsScreen() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await apiFetch<CampaignsResponse>("/campaigns");
      if (res.ok && !cancelled) {
        setCampaigns(res.data.campaigns);
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col gap-4 pt-4 pb-nav px-4 max-w-md mx-auto">
      <div className="bg-animated" />
      <header className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gradient flex items-center justify-center gap-2">
          <PiRocketLaunch /> Campaigns
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete partner campaigns to earn rewards
        </p>
      </header>

      {loading ? (
        <LoadingState />
      ) : campaigns.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="glass-panel p-8 text-center mt-4">
      <div className="w-8 h-8 mx-auto rounded-full border-3
        border-slate-200 border-t-blue-500 animate-spin" />
      <p className="text-sm text-slate-500 mt-3">Loading campaigns...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-panel p-8 text-center mt-4">
      <div className="flex justify-center mb-3 text-slate-400"><PiRocketLaunch size={48} /></div>
      <p className="font-semibold text-slate-700">No active campaigns</p>
      <p className="text-sm text-slate-500 mt-1">
        New partner campaigns will appear here soon
      </p>
    </div>
  );
}
