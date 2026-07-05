import { PiPersonSimpleRun, PiTicket, PiChartBar } from "react-icons/pi";
import CountdownBadge from "./CountdownBadge";
import type { Campaign } from "../../hooks/useCampaignDetail";

export default function CampaignMetadataBar({
  campaign,
}: {
  campaign: Campaign;
}) {
  return (
    <div className="glass-panel p-3 flex flex-wrap items-center gap-2">
      {campaign.campaign_type === "fcfs" && (
        <span className="badge-fcfs flex items-center gap-1">
          <PiPersonSimpleRun /> {campaign.current_completions}/
          {campaign.max_completions}
        </span>
      )}
      {campaign.campaign_type === "raffle" && (
        <span className="badge-raffle flex items-center gap-1">
          <PiTicket /> Raffle
        </span>
      )}
      <span className="text-[11px] text-slate-400 flex items-center gap-1">
        <PiChartBar /> {campaign.participant_count} joined
      </span>
      {campaign.expires_at && (
        <CountdownBadge expiresAt={campaign.expires_at} />
      )}
      {campaign.reward_pool > 0 && (
        <span className="text-[11px] font-semibold text-blue-500 capitalize">
          Pool: {Number(campaign.reward_pool)} {campaign.reward_type === 'ton' ? 'TON' : campaign.reward_type + 's'}
        </span>
      )}
    </div>
  );
}
