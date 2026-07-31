import { useState } from "react";
import { PiTree, PiWarningCircle } from "react-icons/pi";
import { apiFetch } from "../../../lib/api";

export default function AdminTreeTab() {
  const [loading, setLoading] = useState(false);

  const handleSettleSeason = async () => {
    if (!confirm("Are you SURE you want to manually settle the Tree Season? This will reset all user water progress to 0, distribute TON to the top 3, and add 30 days to the season clock!")) {
      return;
    }
    setLoading(true);
    const res = await apiFetch("/admin/tree/settle", "POST");
    setLoading(false);
    
    if (res.ok) {
      alert("Successfully settled the tree season!");
    } else {
      alert("Failed to settle season.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
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
          disabled={loading}
          className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-emerald-600 transition-colors disabled:bg-slate-300 disabled:text-slate-500"
        >
          <PiTree size={18} />
          {loading ? "Processing..." : "Settle Season & Start Next"}
        </button>
      </div>
    </div>
  );
}
