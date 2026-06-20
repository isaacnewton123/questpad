import { useState, useEffect } from "react";
import { PiRocketLaunch, PiCheckCircle } from "react-icons/pi";
import CampaignCard, { type CampaignData } from "../components/campaign/CampaignCard";
import { apiFetch } from "../lib/api";

interface CampaignsResponse {
  campaigns: CampaignData[];
  joined_campaigns: CampaignData[];
}

export default function CampaignsScreen() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [joinedCampaigns, setJoinedCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "joined">("active");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await apiFetch<CampaignsResponse>("/campaigns");
      if (res.ok && !cancelled) {
        setCampaigns(res.data?.campaigns ?? []);
        setJoinedCampaigns(res.data?.joined_campaigns ?? []);
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const currentList = activeTab === "active" ? campaigns : joinedCampaigns;

  return (
    <div className="flex flex-col gap-4 pt-4 pb-nav px-4 max-w-md mx-auto">
      <div className="bg-animated" />
      <header className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gradient flex items-center justify-center gap-2">
          <PiRocketLaunch /> Campaigns
        </h1>
        <p className="text-xs text-slate-500 mt-1">Complete partner campaigns to earn rewards</p>
      </header>

      <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

      {loading ? (
        <LoadingState />
      ) : currentList.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div className="flex flex-col gap-3">
          {currentList.map((c) => (
            <CampaignCard key={c.id} campaign={c} isJoined={activeTab === "joined"} />
          ))}
        </div>
      )}
    </div>
  );
}

function TabSwitcher({
  activeTab,
  setActiveTab,
}: {
  activeTab: "active" | "joined";
  setActiveTab: (t: "active" | "joined") => void;
}) {
  return (
    <div className="flex bg-slate-100 rounded-xl p-1 mb-2">
      <button
        onClick={() => setActiveTab("active")}
        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
          activeTab === "active" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Active
      </button>
      <button
        onClick={() => setActiveTab("joined")}
        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
          activeTab === "joined" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Joined
      </button>
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

function EmptyState({ tab }: { tab: "active" | "joined" }) {
  if (tab === "joined") {
    return (
      <div className="glass-panel p-8 text-center mt-4">
        <div className="flex justify-center mb-3 text-slate-400"><PiCheckCircle size={48} /></div>
        <p className="font-semibold text-slate-700">No joined campaigns</p>
        <p className="text-sm text-slate-500 mt-1">You haven't participated in any campaigns yet.</p>
      </div>
    );
  }
  return (
    <div className="glass-panel p-8 text-center mt-4">
      <div className="flex justify-center mb-3 text-slate-400"><PiRocketLaunch size={48} /></div>
      <p className="font-semibold text-slate-700">No active campaigns</p>
      <p className="text-sm text-slate-500 mt-1">New partner campaigns will appear here soon</p>
    </div>
  );
}
