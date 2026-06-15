import { useState, useEffect, useCallback } from "react";
import { PiFire, PiGift } from "react-icons/pi";
import SpinWheel, { type WheelSegment } from "../components/SpinWheel";
import ResultModal from "../components/ResultModal";
import CooldownTimer from "../components/CooldownTimer";
import BalanceBar from "../components/BalanceBar";
import { useUser } from "../context/useUser";
import { apiFetch } from "../lib/api";
import { supabase } from "../lib/supabase";

interface SpinPrize {
  id: string;
  prize_name: string;
  prize_type: "ton" | "coin";
  prize_value: number;
}

interface SpinResponse {
  prize_name: string;
  prize_type: "ton" | "coin";
  prize_value: number;
  streak: number;
  spin_type: string;
  error?: string;
}

interface SpinState {
  segments: WheelSegment[];
  prizes: SpinPrize[];
  spinning: boolean;
  targetIndex: number | null;
  result: SpinResponse | null;
  showResult: boolean;
}

export default function SpinScreen() {
  const { user, refetchUser } = useUser();
  const [state, setState] = useState<SpinState>({
    segments: [], prizes: [], spinning: false,
    targetIndex: null, result: null, showResult: false,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase
        .from("spin_config")
        .select("id, prize_name, prize_type, prize_value")
        .eq("is_active", true);

      if (data && data.length > 0 && !cancelled) {
        setState((s) => ({
          ...s,
          prizes: data as SpinPrize[],
          segments: data.map((p) => ({ 
            label: p.prize_name,
            type: p.prize_type,
            value: p.prize_value
          })),
        }));
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 pt-4 pb-nav px-4">
      <div className="bg-animated" />
      <SpinHeader />
      <BalanceBar />
      <div className="flex items-center justify-center gap-2">
        <StreakBadge streak={user?.spin_streak ?? 0} />
        {(user?.bonus_spins ?? 0) > 0 && <BonusBadge count={user!.bonus_spins} />}
      </div>
      <WheelArea state={state} setState={setState} refetchUser={refetchUser} />
      <SpinControls
        user={user}
        state={state}
        setState={setState}
      />
    </div>
  );
}

function SpinHeader() {
  return (
    <header className="w-full max-w-md flex flex-col items-center justify-center">
      <img src="/logo-with-name.webp" alt="QuestPad" className="h-16 object-contain drop-shadow-md" />
      <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
        Spin to Earn
      </p>
    </header>
  );
}

function StreakBadge({ streak }: { streak: number }) {
  if (streak <= 0) return null;
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold
      text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
      <PiFire size={14} className="text-amber-500" /> {streak} day streak
    </div>
  );
}

function BonusBadge({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold
      text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
      <PiGift size={14} className="text-indigo-500" /> {count} Bonus Spin{count !== 1 ? 's' : ''}
    </div>
  );
}

function WheelArea({ state, setState, refetchUser }: {
  state: SpinState;
  setState: React.Dispatch<React.SetStateAction<SpinState>>;
  refetchUser: () => Promise<void>;
}) {
  function handleSpinEnd() {
    setState((s) => ({ ...s, spinning: false, showResult: true }));
  }

  function handleCloseResult() {
    setState((s) => ({
      ...s, showResult: false, result: null, targetIndex: null,
    }));
    refetchUser();
  }

  return (
    <>
      {state.segments.length > 0 && (
        <SpinWheel
          segments={state.segments}
          spinning={state.spinning}
          targetIndex={state.targetIndex}
          onSpinEnd={handleSpinEnd}
        />
      )}
      {state.result && (
        <ResultModal
          prizeName={state.result.prize_name}
          prizeType={state.result.prize_type}
          prizeValue={state.result.prize_value}
          colorIndex={state.targetIndex ?? 0}
          visible={state.showResult}
          onClose={handleCloseResult}
        />
      )}
    </>
  );
}

function SpinControls({ user, state, setState }: {
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
      (p) => p.prize_name === res.data.prize_name
    );
    setState((s) => ({
      ...s, result: res.data, targetIndex: idx >= 0 ? idx : 0, spinning: true,
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
          boxShadow: state.spinning ? "none" :
            "inset 0 1px 1px rgba(255,255,255,0.2), 0 12px 24px -8px rgba(15,23,42,0.5)",
        }}
      >
        SPIN NOW
      </button>
    </div>
  );
}
