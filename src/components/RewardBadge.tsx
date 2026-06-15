import { PiDiamond, PiCoin, PiArrowsClockwise, PiTicket } from "react-icons/pi";
import React from "react";

interface RewardBadgeProps {
  type: string;
  value: number;
}

const REWARD_CONFIG: Record<string, {
  icon: React.ElementType; label: string; color: string;
}> = {
  ton: { icon: PiDiamond, label: "TON", color: "badge-ton" },
  coin: { icon: PiCoin, label: "", color: "badge-coin" },
  spin: { icon: PiArrowsClockwise, label: "", color: "badge-spin" },
  ticket: { icon: PiTicket, label: "", color: "badge-ticket" },
};

export default function RewardBadge({ type, value }: RewardBadgeProps) {
  const cfg = REWARD_CONFIG[type] ?? REWARD_CONFIG.coin;
  const displayVal = type === "ton" ? value.toFixed(2) : value;

  return (
    <span className={`reward-badge flex items-center gap-1 w-fit ${cfg.color}`}>
      +{displayVal} <cfg.icon />
      {cfg.label ? ` ${cfg.label}` : ""}
      {type === "ticket" && (
        <span className="text-[10px] opacity-70 ml-0.5 flex items-center">(+1<PiArrowsClockwise />)</span>
      )}
    </span>
  );
}
