import { useNavigate } from "react-router-dom";
import { PiChartBar, PiTicket, PiPersonSimpleRun } from "react-icons/pi";
import CountdownBadge from "./CountdownBadge";
import RewardBadge from "./RewardBadge";

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
  quests: Array<{ id: string }>;
}

export default function CampaignCard({
  campaign,
}: {
  campaign: CampaignData;
}) {
  const navigate = useNavigate();
  const stepCount = campaign.quests?.length ?? 0;

  return (
    <button
      onClick={() => navigate(`/campaigns/${campaign.id}`)}
      className="campaign-card w-full text-left"
    >
      <div className="flex items-start gap-3">
        <CampaignIcon type={campaign.campaign_type} />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-800 truncate">
            {campaign.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
            {campaign.description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <TypeBadge type={campaign.campaign_type} />
        {campaign.campaign_type === "fcfs" &&
          campaign.max_completions && (
            <FcfsProgress
              current={campaign.current_completions}
              max={campaign.max_completions}
            />
          )}
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <PiChartBar /> {campaign.participant_count} joined
        </span>
      </div>

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
    </button>
  );
}

function CampaignIcon({ type }: { type: string }) {
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
