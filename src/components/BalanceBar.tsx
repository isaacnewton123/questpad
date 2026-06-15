import { SiTon } from "react-icons/si";
import { PiCoinsFill } from "react-icons/pi";
import { useUser } from "../context/useUser";

export default function BalanceBar() {
  const { user } = useUser();
  const ton = user?.ledger_ton ?? 0;
  const coins = user?.coins ?? 0;

  return (
    <div className="flex items-center justify-center gap-4 py-2 px-4">
      <div
        className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm
        rounded-full px-4 py-1.5 border border-slate-200/60 shadow-sm"
      >
        <SiTon className="text-blue-500" size={14} />
        <span className="text-sm font-bold text-slate-800">
          {Number(ton).toFixed(3)}
        </span>
        <span className="text-[10px] font-semibold text-slate-400">TON</span>
      </div>
      <div
        className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm
        rounded-full px-4 py-1.5 border border-slate-200/60 shadow-sm"
      >
        <PiCoinsFill className="text-amber-500" size={16} />
        <span className="text-sm font-bold text-slate-800">{coins}</span>
        <span className="text-[10px] font-semibold text-slate-400">
          Coins
        </span>
      </div>
    </div>
  );
}
