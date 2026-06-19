import { useState } from "react";
import { PiSpinnerBallFill, PiShieldCheck, PiStorefront, PiPaintBrush } from "react-icons/pi";
import { PiCoinsFill } from "react-icons/pi";
import { useUser } from "../context/useUser";
import { apiFetch } from "../lib/api";
import StoreCard, { type StoreItem } from "../components/store/StoreCard";

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

export default function StoreScreen() {
  const { user, refetchUser } = useUser();
  const [buying, setBuying] = useState<string | null>(null);
  const coins = user?.coins ?? 0;

  async function handlePurchase(itemType: string) {
    setBuying(itemType);
    await apiFetch("/store/purchase", "POST", { item_type: itemType });
    setBuying(null);
    refetchUser();
  }

  return (
    <div className="flex flex-col gap-4 pt-4 pb-nav px-4 max-w-md mx-auto">
      <div className="bg-animated" />
      <header className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gradient flex items-center justify-center gap-2">
          <PiStorefront /> Store
        </h1>
        <p className="text-xs text-slate-500 mt-1">Spend your Coins on power-ups</p>
      </header>
      <div className="flex items-center justify-center gap-1.5 mb-2">
        <PiCoinsFill className="text-amber-500" size={18} />
        <span className="font-bold text-slate-800">{coins}</span>
        <span className="text-sm text-slate-500">Coins available</span>
      </div>
      <div className="flex flex-col gap-3">
        {STORE_ITEMS.map((item) => (
          <StoreCard key={item.type} item={item} coins={coins} buying={buying === item.type} onBuy={() => handlePurchase(item.type)} />
        ))}
      </div>
    </div>
  );
}
