import { useCallback } from "react";
import CooldownTimer from "./CooldownTimer";
import { useUser } from "../../context/useUser";
import { apiFetch } from "../../lib/api";
import type { SpinState } from "./WheelArea";

interface SpinResponse {
  prize_name: string;
  prize_type: "ton" | "coin";
  prize_value: number;
  streak: number;
  spin_type: string;
  error?: string;
}

export default function SpinControls({
  user,
  state,
  setState,
}: {
  user: ReturnType<typeof useUser>["user"];
  state: SpinState;
  setState: React.Dispatch<React.SetStateAction<SpinState>>;
}) {
  const canSpin = useCallback(() => {
    if (!user) return false;
    if (user.bonus_spins > 0) return true;
    if (!user.last_spin_at) return true;
    const elapsed = Date.now() - new Date(user.last_spin_at).getTime();
    return elapsed >= 24 * 60 * 60 * 1000;
  }, [user]);

  async function handleSpin() {
    if (state.spinning || !canSpin()) return;
    const res = await apiFetch<SpinResponse>("/spin/execute", "POST");
    if (!res.ok || res.data.error) return;
    const idx = state.prizes.findIndex(
      (p) => p.prize_name === res.data.prize_name,
    );
    setState((s) => ({
      ...s,
      result: res.data,
      targetIndex: idx >= 0 ? idx : 0,
      spinning: true,
    }));
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-3">
      <CooldownTimer lastSpinAt={user?.last_spin_at ?? null} />
      <button
        onClick={handleSpin}
        disabled={state.spinning || !canSpin()}
        className="w-full max-w-[240px] text-white font-bold text-sm uppercase
          tracking-widest py-3.5 rounded-full transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:not-disabled:-translate-y-0.5 hover:not-disabled:scale-[1.02]
          active:not-disabled:translate-y-0.5 active:not-disabled:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: state.spinning
            ? "none"
            : "inset 0 1px 1px rgba(255,255,255,0.2), 0 12px 24px -8px rgba(15,23,42,0.5)",
        }}
      >
        SPIN NOW
      </button>
    </div>
  );
}
