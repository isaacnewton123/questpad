import { useState, useEffect } from "react";
import SpinHeader from "../components/spin/SpinHeader";
import BalanceBar from "../components/ui/BalanceBar";
import { StreakBadge, BonusBadge } from "../components/spin/SpinBadges";
import WheelArea, { type SpinState } from "../components/spin/WheelArea";
import SpinControls from "../components/spin/SpinControls";
import { useUser } from "../context/useUser";
import { supabase } from "../lib/supabase";

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
      <SpinControls user={user} state={state} setState={setState} />
    </div>
  );
}
