import { PiCoinsFill } from "react-icons/pi";

export interface StoreItem {
  type: string;
  label: string;
  description: string;
  cost: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
}

export default function StoreCard({ item, coins, buying, onBuy }: {
  item: StoreItem; coins: number; buying: boolean; onBuy: () => void;
}) {
  const canAfford = coins >= item.cost;
  const Icon = item.icon;

  return (
    <div className="glass-panel p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-2xl ${item.bgColor} flex
        items-center justify-center shrink-0 border border-white/50`}>
        <Icon size={22} className={item.color} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-slate-800">{item.label}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
        <div className="flex items-center gap-1 mt-2">
          <PiCoinsFill size={12} className="text-amber-500" />
          <span className="text-xs font-bold text-amber-600">
            {item.cost} Coins
          </span>
        </div>
      </div>
      <button
        onClick={onBuy}
        disabled={!canAfford || buying}
        className={`shrink-0 text-xs font-bold px-4 py-2 rounded-full
          transition-all ${
            canAfford
              ? "bg-slate-900 text-white hover:bg-slate-700 active:scale-95"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
      >
        {buying ? "..." : "Buy"}
      </button>
    </div>
  );
}
