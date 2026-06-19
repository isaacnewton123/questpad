import { SiTon } from "react-icons/si";
import { PiCoinsFill } from "react-icons/pi";

export default function BalanceDisplay({ ton, coins }: { ton: number; coins: number }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <SiTon className="text-blue-500" size={18} />
        <span className="text-2xl font-bold text-slate-800">
          {ton.toFixed(3)}
        </span>
        <span className="text-sm text-slate-400">TON</span>
      </div>
      <div className="flex items-center gap-1.5">
        <PiCoinsFill className="text-amber-500" size={16} />
        <span className="font-bold text-slate-800">{coins}</span>
        <span className="text-xs text-slate-400">Coins</span>
      </div>
    </div>
  );
}
