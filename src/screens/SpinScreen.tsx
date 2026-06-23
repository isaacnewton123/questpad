import { useState, useEffect } from "react";
import { RiDonutChartFill, RiTaskFill, RiStore2Fill } from "react-icons/ri";
import SpinHeader from "../components/spin/SpinHeader";
import BalanceBar from "../components/ui/BalanceBar";
import { StreakBadge, BonusBadge } from "../components/spin/SpinBadges";
import WheelArea, { type SpinState } from "../components/spin/WheelArea";
import SpinControls from "../components/spin/SpinControls";
import SpinMissions from "../components/spin/SpinMissions";
import SpinStore from "../components/spin/SpinStore";
import { useUser } from "../context/useUser";
import type { UserProfile } from "../context/UserContext";
import { supabase } from "../lib/supabase";

type SpinTab = "play" | "missions" | "store";

export default function SpinScreen() {
  const { user, refetchUser } = useUser();
  const [activeTab, setActiveTab] = useState<SpinTab>("play");
  const [state, setState] = useState<SpinState>({
    segments: [], prizes: [], spinning: false,
    targetIndex: null, result: null, showResult: false,
  });

  useLoadSpinPrizes(setState);

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-100/80 via-slate-50 to-slate-100 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center gap-4 pt-4 pb-nav px-4 max-w-md mx-auto w-full flex-1">
        <SpinHeader />

      <div className="w-full flex-1">
        <SpinContent
          activeTab={activeTab}
          state={state}
          setState={setState}
          user={user}
          refetchUser={refetchUser}
        />
      </div>

      <GameNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

function useLoadSpinPrizes(setState: React.Dispatch<React.SetStateAction<SpinState>>) {
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
          prizes: data,
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
  }, [setState]);
}

interface SpinContentProps {
  activeTab: SpinTab;
  state: SpinState;
  setState: React.Dispatch<React.SetStateAction<SpinState>>;
  user: UserProfile | null;
  refetchUser: () => Promise<void>;
}

function SpinContent({ activeTab, state, setState, user, refetchUser }: SpinContentProps) {
  if (activeTab === "play") {
    return (
      <div className="flex flex-col items-center gap-4">
        <BalanceBar />
        <div className="flex items-center justify-center gap-2 w-full">
          <StreakBadge streak={user?.spin_streak ?? 0} />
          {(user?.bonus_spins ?? 0) > 0 && <BonusBadge count={user!.bonus_spins} />}
        </div>
        <WheelArea state={state} setState={setState} refetchUser={refetchUser} />
        <SpinControls user={user} state={state} setState={setState} />
      </div>
    );
  }
  if (activeTab === "missions") return <SpinMissions />;
  if (activeTab === "store") return <SpinStore />;
  return null;
}

function GameNav({
  activeTab,
  onTabChange,
}: {
  activeTab: SpinTab;
  onTabChange: (tab: SpinTab) => void;
}) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-100 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]"
      style={{
        borderRadius: "24px 24px 0 0",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-4">
        <button
          onClick={() => onTabChange("play")}
          className={`flex flex-col items-center gap-1 px-2 py-1.5 transition-all duration-200 ${
            activeTab === "play" ? "text-blue-500 scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <RiDonutChartFill size={20} />
          <span className="text-[10px] font-semibold tracking-wide">Play</span>
        </button>
        <button
          onClick={() => onTabChange("missions")}
          className={`flex flex-col items-center gap-1 px-2 py-1.5 transition-all duration-200 ${
            activeTab === "missions" ? "text-emerald-500 scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <RiTaskFill size={20} />
          <span className="text-[10px] font-semibold tracking-wide">Missions</span>
        </button>
        <button
          onClick={() => onTabChange("store")}
          className={`flex flex-col items-center gap-1 px-2 py-1.5 transition-all duration-200 ${
            activeTab === "store" ? "text-purple-500 scale-105" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <RiStore2Fill size={20} />
          <span className="text-[10px] font-semibold tracking-wide">Store</span>
        </button>
      </div>
    </nav>
  );
}
