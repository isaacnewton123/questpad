import { PiCheckCircle } from "react-icons/pi";

export default function CheckInSuccessModal({
  onClose,
  rewardType = "coin",
  rewardValue = 50
}: {
  onClose: () => void;
  rewardType?: "coin" | "spin" | "water";
  rewardValue?: number;
}) {
  const isSpin = rewardType === "spin";
  const isWater = rewardType === "water";
  const rewardName = isSpin ? "Spin" : isWater ? "Water Drops" : "Coins";
  
  const bgColor = isSpin ? "bg-emerald-100 border-emerald-50" : isWater ? "bg-cyan-100 border-cyan-50" : "bg-amber-100 border-amber-50";
  const iconColor = isSpin ? "text-emerald-500" : isWater ? "text-cyan-500" : "text-amber-500";
  const btnColor = isSpin ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200" : isWater ? "bg-cyan-500 hover:bg-cyan-600 shadow-cyan-200" : "bg-amber-500 hover:bg-amber-600 shadow-amber-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mb-4 border-4`}>
            <PiCheckCircle className={iconColor} size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Success!</h2>
          <p className="text-sm text-slate-500 mb-6">
            You've successfully claimed <strong className={iconColor}>{rewardValue} {rewardName}</strong>.
          </p>
          <button
            onClick={onClose}
            className={`w-full py-3 ${btnColor} active:scale-[0.98] text-white font-bold rounded-2xl transition-all shadow-sm`}
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}
