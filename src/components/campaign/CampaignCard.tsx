import { useNavigate } from "react-router-dom";
import { PiChartBar, PiTicket, PiPersonSimpleRun } from "react-icons/pi";
import CountdownBadge from "./CountdownBadge";
import RewardBadge from "../ui/RewardBadge";

export interface CampaignData {
  id: string;
  title: string;
  description: string;
  campaign_type: string;
  reward_type: string;
  reward_value: number;
  reward_pool: number;
  max_completions: number | null;
  current_completions: number;
  participant_count: number;
  expires_at: string;
  is_drawn?: boolean;
  logo_url?: string;
  quests: Array<{ id: string }>;
}

export default function CampaignCard({
  campaign,
  isJoined = false,
}: {
  campaign: CampaignData;
  isJoined?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/campaigns/${campaign.id}`)}
      className="campaign-card w-full text-left"
    >
      <CampaignHeader campaign={campaign} />
      <CampaignProgress campaign={campaign} isJoined={isJoined} />
      <CampaignFooter campaign={campaign} />
    </button>
  );
}

function CampaignHeader({ campaign }: { campaign: CampaignData }) {
  return (
    <div className="flex items-start gap-3">
      <CampaignIcon type={campaign.campaign_type} logo_url={campaign.logo_url} />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-slate-800 truncate">
          {campaign.title}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
          {campaign.description}
        </p>
      </div>
    </div>
  );
}

function CampaignProgress({ campaign, isJoined }: { campaign: CampaignData; isJoined: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <TypeBadge type={campaign.campaign_type} />
      {isJoined ? (
        <JoinedStatusBadge type={campaign.campaign_type} isDrawn={campaign.is_drawn} />
      ) : (
        <>
          {campaign.campaign_type === "fcfs" && campaign.max_completions && (
            <FcfsProgress
              current={campaign.current_completions}
              max={campaign.max_completions}
            />
          )}
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <PiChartBar /> {campaign.participant_count} joined
          </span>
        </>
      )}
    </div>
  );
}

function CampaignFooter({ campaign }: { campaign: CampaignData }) {
  const stepCount = campaign.quests?.length ?? 0;
  return (
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-slate-400">
          {stepCount} task{stepCount !== 1 ? "s" : ""}
        </span>
        <RewardBadge
          type={campaign.reward_type}
          value={campaign.reward_value}
        />
      </div>
      <CountdownBadge expiresAt={campaign.expires_at} />
    </div>
  );
}

function JoinedStatusBadge({ type, isDrawn }: { type: string; isDrawn?: boolean }) {
  if (type === "fcfs") {
    return <span className="text-[11px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-md">Reward Claimed</span>;
  }
  if (type === "raffle") {
    if (isDrawn) {
      return <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">Raffle Completed</span>;
    }
    return <span className="text-[11px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">Pending Draw</span>;
  }
  return <span className="text-[11px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">Joined</span>;
}

function CampaignIcon({ type, logo_url }: { type: string, logo_url?: string }) {
  if (logo_url) {
    return (
      <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 border border-slate-100 bg-white">
        <img src={logo_url} alt="Sponsor Logo" className="w-full h-full object-cover" />
      </div>
    );
  }

  const Icon = type === "raffle" ? PiTicket : PiPersonSimpleRun;
  return (
    <div className="w-10 h-10 rounded-2xl bg-blue-50
      flex items-center justify-center shrink-0
      border border-blue-100 text-lg"
    >
      <Icon size={24} className="text-blue-500" />
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  if (type === "fcfs") {
    return <span className="badge-fcfs flex items-center gap-1"><PiPersonSimpleRun /> FCFS</span>;
  }
  if (type === "raffle") {
    return <span className="badge-raffle flex items-center gap-1"><PiTicket /> Raffle</span>;
  }
  return null;
}

function FcfsProgress({
  current, max,
}: {
  current: number; max: number;
}) {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <span className="badge-fcfs-progress">
      <span
        className="badge-fcfs-fill"
        style={{ width: `${pct}%` }}
      />
      <span className="relative z-10">
        {current}/{max}
      </span>
    </span>
  );
}
