import { useState } from "react";
import { PiSpinnerBallFill, PiShieldCheck, PiPaintBrush } from "react-icons/pi";
import { PiCoinsFill } from "react-icons/pi";
import { useUser } from "../context/useUser";
import { apiFetch } from "../lib/api";

interface StoreItem {
  type: string;
  label: string;
  description: string;
  cost: number;
  icon: typeof PiSpinnerBallFill;
  color: string;
  bgColor: string;
}

const STORE_ITEMS: StoreItem[] = [
  {
    type: "extra_spin",
    label: "Extra Spin",
    description: "Get 1 additional bonus spin today",
    cost: 100,
    icon: PiSpinnerBallFill,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    type: "streak_shield",
    label: "Streak Shield",
    description: "Protect your spin streak for 1 day",
    cost: 200,
    icon: PiShieldCheck,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    type: "theme",
    label: "Neon Wheel Theme",
    description: "Unlock a neon glow effect for your wheel",
    cost: 500,
    icon: PiPaintBrush,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

interface PurchaseResponse {
  message?: string;
  error?: string;
  coins_remaining?: number;
}

export default function StoreScreen() {
  const { user, refetchUser } = useUser();
  const [buying, setBuying] = useState<string | null>(null);
  const coins = user?.coins ?? 0;

  async function handlePurchase(itemType: string) {
    setBuying(itemType);
    await apiFetch<PurchaseResponse>("/store/purchase", "POST", {
      item_type: itemType,
    });
    setBuying(null);
    refetchUser();
  }

  return (
    <div className="flex flex-col gap-4 pt-4 pb-nav px-4 max-w-md mx-auto">
      <div className="bg-animated" />

      <header className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gradient">Store</h1>
        <p className="text-xs text-slate-500 mt-1">
          Spend your Coins on power-ups
        </p>
      </header>

      <div className="flex items-center justify-center gap-1.5 mb-2">
        <PiCoinsFill className="text-amber-500" size={18} />
        <span className="font-bold text-slate-800">{coins}</span>
        <span className="text-sm text-slate-500">Coins available</span>
      </div>

      <div className="flex flex-col gap-3">
        {STORE_ITEMS.map((item) => (
          <StoreCard
            key={item.type}
            item={item}
            coins={coins}
            buying={buying === item.type}
            onBuy={() => handlePurchase(item.type)}
          />
        ))}
      </div>
    </div>
  );
}

function StoreCard({ item, coins, buying, onBuy }: {
  item: StoreItem; coins: number; buying: boolean; onBuy: () => void;
}) {
  const canAfford = coins >= item.cost;
  const Icon = item.icon;

  return (
    <div className="glass-panel p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-2xl ${item.bgColor} flex
        items-center justify-center flex-shrink-0 border border-white/50`}>
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
        className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full
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
