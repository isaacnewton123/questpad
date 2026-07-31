import { useState, useEffect } from "react";
import { PiTree, PiWarningCircle, PiPlayFill, PiStopFill } from "react-icons/pi";
import { apiFetch } from "../../../lib/api";

export default function AdminTreeTab() {
  const [loading, setLoading] = useState(false);
  const [isEnded, setIsEnded] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    const fetchState = async () => {
      const res = await apiFetch<{ is_ended: boolean }>("/admin/tree/state", "GET");
      if (active && res.ok) setIsEnded(res.data?.is_ended ?? false);
    };
    fetchState();
    return () => { active = false; };
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <SettleSeasonSection loading={loading} setLoading={setLoading} isEnded={isEnded} />
        <hr className="border-slate-100 my-4" />
        <ToggleSeasonStateSection loading={loading} setLoading={setLoading} isEnded={isEnded} setIsEnded={setIsEnded} />
      </div>
    </div>
  );
}

function SettleSeasonSection({ loading, setLoading, isEnded }: { loading: boolean, setLoading: (l: boolean) => void, isEnded: boolean | null }) {
  const handleSettleSeason = async () => {
    if (!confirm("Are you SURE you want to manually settle the Tree Season? This will reset all user water progress to 0, distribute TON to the top 3, and add 30 days to the season clock!")) {
      return;
    }
    setLoading(true);
    const res = await apiFetch("/admin/tree/settle", "POST");
    setLoading(false);
    
    if (res.ok) alert("Successfully settled the tree season!");
    else alert("Failed to settle season.");
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <PiTree className="text-emerald-500" />
          Tree Season Management
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Seasons are no longer automatically processed. You must click this button at the end of each season to distribute rewards and start the next season.
        </p>
      </div>

      <div className="bg-amber-50 rounded-xl p-3 mb-4 flex items-start gap-2 border border-amber-100">
        <PiWarningCircle className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-700 leading-tight">
          <strong>Warning:</strong> Clicking this button will immediately end the current season. Do not click this if the season timer hasn't finished yet.
        </p>
      </div>

      <button
        onClick={handleSettleSeason}
        disabled={loading || isEnded === null}
        className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-emerald-600 transition-colors disabled:bg-slate-300 disabled:text-slate-500 mb-4"
      >
        <PiTree size={18} />
        {loading ? "Processing..." : "Settle Season & Start Next"}
      </button>
    </>
  );
}

function ToggleSeasonStateSection({ loading, setLoading, isEnded, setIsEnded }: { loading: boolean, setLoading: (l: boolean) => void, isEnded: boolean | null, setIsEnded: (v: boolean) => void }) {
  const handleToggleEnded = async () => {
    const action = isEnded ? "START NEW" : "END";
    if (!confirm(`Are you sure you want to ${action} the Tree Season?`)) return;

    setLoading(true);
    const res = await apiFetch<{ is_ended: boolean }>("/admin/tree/toggle-ended", "POST");
    setLoading(false);

    if (res.ok) setIsEnded(res.data?.is_ended ?? false);
    else alert(`Failed to ${action.toLowerCase()} season.`);
  };

  return (
    <>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800">Season State: {isEnded ? <span className="text-amber-500">ENDED</span> : <span className="text-emerald-500">ACTIVE</span>}</h3>
        <p className="text-xs text-slate-500 mt-1">
          Ending the season will lock all users out of the Tree Game with a "Season Ended" screen.
        </p>
      </div>

      <button
        onClick={handleToggleEnded}
        disabled={loading || isEnded === null}
        className={`w-full font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors disabled:bg-slate-300 disabled:text-slate-500 ${
          isEnded 
            ? "bg-slate-800 text-white hover:bg-slate-900" 
            : "bg-amber-100 text-amber-600 hover:bg-amber-200"
        }`}
      >
        {isEnded ? <PiPlayFill size={18} /> : <PiStopFill size={18} />}
        {loading ? "Processing..." : isEnded ? "Start Season" : "End Season"}
      </button>
    </>
  );
}
