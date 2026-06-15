import { useState, useEffect } from "react";
import { PiClock } from "react-icons/pi";

interface CountdownBadgeProps {
  expiresAt: string;
}

export default function CountdownBadge({ expiresAt }: CountdownBadgeProps) {
  const [label, setLabel] = useState(() => calcLabel(expiresAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setLabel(calcLabel(expiresAt));
    }, 60_000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const isExpired = label === "Expired";

  return (
    <span className={`badge-countdown flex items-center gap-1 ${isExpired ? "badge-expired" : ""}`}>
      <PiClock /> {label}
    </span>
  );
}

function calcLabel(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);

  if (days > 0) return `${days}d ${hours}h`;
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}
