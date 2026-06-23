import { useState } from "react";
import { PiSpinnerBallFill, PiShieldCheck, PiStorefront, PiPaintBrush, PiCoinsFill } from "react-icons/pi";
import { useUser } from "../../context/useUser";
import { apiFetch } from "../../lib/api";
import StoreCard, { type StoreItem } from "../store/StoreCard";

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

export default function SpinStore() {
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
    <section className="w-full mt-4">
      <div className="flex items-center justify-between section-header mb-3">
        <div className="flex items-center gap-2">
          <PiStorefront className="text-blue-500" /> Spin Shop
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
          <PiCoinsFill className="text-amber-500" size={14} />
          <span className="text-xs font-bold text-amber-700">{coins}</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {STORE_ITEMS.map((item) => (
          <StoreCard key={item.type} item={item} coins={coins} buying={buying === item.type} onBuy={() => handlePurchase(item.type)} />
        ))}
      </div>
    </section>
  );
}
