import { useState, useEffect } from "react";
import { PiClock, PiSparkle } from "react-icons/pi";

interface CooldownTimerProps {
  lastSpinAt: string | null;
  cooldownMs?: number;
}

export default function CooldownTimer({
  lastSpinAt,
  cooldownMs = 24 * 60 * 60 * 1000,
}: CooldownTimerProps) {
  const [remaining, setRemaining] = useState(() =>
    calcRemaining(lastSpinAt, cooldownMs)
  );

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      const r = calcRemaining(lastSpinAt, cooldownMs);
      setRemaining(r);
      if (r <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [lastSpinAt, cooldownMs, remaining]);

  if (remaining <= 0) {
    return (
      <span className="text-emerald-500 font-bold text-sm flex items-center gap-1 justify-center animate-pulse">
        <PiSparkle /> Spin Available!
      </span>
    );
  }

  return (
    <span className="text-slate-500 font-semibold text-sm flex items-center gap-1 justify-center tabular-nums">
      <PiClock /> Next spin in {formatTime(remaining)}
    </span>
  );
}

function calcRemaining(lastSpinAt: string | null, cooldownMs: number): number {
  if (!lastSpinAt) return 0;
  const elapsed = Date.now() - new Date(lastSpinAt).getTime();
  return Math.max(0, cooldownMs - elapsed);
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
