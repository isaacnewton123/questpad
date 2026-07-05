import { PiCheck, PiArrowRight } from "react-icons/pi";
import RewardBadge from "../ui/RewardBadge";
import type { Campaign } from "../../hooks/useCampaignDetail";

export default function ClaimSection({
  campaign,
  canClaim,
  claimed,
  claiming,
  onClaim,
}: {
  campaign: Campaign;
  canClaim: boolean;
  claimed: boolean;
  claiming: boolean;
  onClaim: () => void;
}) {
  const isRaffle = campaign.campaign_type === "raffle";

  if (isRaffle && campaign.is_drawn) {
    return (
      <section className="glass-panel p-4 text-center">
        <p className="text-slate-700 font-bold mb-1">
          Raffle has concluded! 🎉
        </p>
        <p className="text-xs text-slate-500">
          Check your balance in your profile to see if you won!
        </p>
      </section>
    );
  }

  const btnClass = claimed
    ? "bg-emerald-50 text-emerald-600"
    : canClaim
      ? "bg-slate-900 text-white active:scale-[0.98]"
      : "bg-slate-100 text-slate-400";

  return (
    <section className="glass-panel p-4 text-center">
      <p className="text-xs text-slate-500 mb-2">Reward</p>
      <div className="flex items-center justify-center gap-1 mb-4">
        <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
          Complete all tasks <PiArrowRight />
        </span>
        <RewardBadge
          type={campaign.reward_type}
          value={campaign.reward_value}
        />
      </div>
      <button
        onClick={onClaim}
        disabled={!canClaim || claiming}
        className={`w-full py-3 rounded-2xl text-sm font-bold transition-all ${btnClass}`}
      >
        {getBtnLabel(isRaffle, claimed, claiming)}
      </button>
    </section>
  );
}

function getBtnLabel(isRaffle: boolean, claimed: boolean, claiming: boolean) {
  if (claimed) {
    return (
      <span className="flex items-center justify-center gap-1">
        <PiCheck /> {isRaffle ? "Entered Raffle" : "Reward Claimed"}
      </span>
    );
  }
  if (claiming) return isRaffle ? "Entering..." : "Claiming...";
  return isRaffle ? "Enter Raffle" : "Claim Reward";
}
