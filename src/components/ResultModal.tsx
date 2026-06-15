import { useEffect } from "react";
import { PiConfetti, PiGift } from "react-icons/pi";
import { PrizeIcon } from "./SpinWheel";

const PALETTE = [
  "#FF7675", "#74B9FF", "#FDCB6E", "#A29BFE",
  "#00CEC9", "#FF9FF3", "#FAB1A0", "#81ECEC",
  "#FFEAA7", "#6C5CE7",
];

interface ResultModalProps {
  prizeName: string;
  prizeType: "ton" | "coin";
  prizeValue: number;
  colorIndex: number;
  visible: boolean;
  onClose: () => void;
  onShare?: () => void;
}

export default function ResultModal(props: ResultModalProps) {
  useEffect(() => {
    if (props.visible) spawnConfetti();
  }, [props.visible]);

  if (!props.visible) return null;

  return (
    <>
      <div
        className={`result-overlay ${props.visible ? "show" : ""}`}
        onClick={props.onClose}
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        onClick={props.onClose}
      >
        <ModalCard {...props} />
      </div>
    </>
  );
}

function ModalCard({
  prizeName, prizeType, prizeValue,
  colorIndex, onClose, onShare,
}: ResultModalProps) {
  const bgColor = PALETTE[colorIndex % PALETTE.length];
  const isBigWin = prizeType === "ton" && prizeValue >= 0.01;

  return (
    <div
      className="glass-panel p-8 text-center flex flex-col items-center
        max-w-[340px] w-full animate-[scaleIn_0.5s_ease]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-20 h-20 rounded-2xl mb-4 flex items-center justify-center text-white" style={{
        background: bgColor,
        boxShadow:
          "inset 0 2px 10px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.08)",
      }}>
        <PrizeIcon type={prizeType} value={prizeValue} size={48} />
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
        {isBigWin ? <><PiConfetti className="inline mb-0.5" /> Jackpot!</> : "You Won"}
      </p>
      <p className="text-3xl font-bold text-slate-800 break-words w-full"
        style={{ lineHeight: 1.1 }}>
        {prizeName}
      </p>
      {onShare && (
        <button onClick={onShare}
          className="mt-6 bg-primary text-white font-semibold text-sm
            rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl transition-all">
          <span className="flex items-center justify-center gap-1.5">Share & Earn Bonus <PiGift size={16} /></span>
        </button>
      )}
      <button onClick={onClose}
        className="mt-4 text-sm font-semibold text-slate-500
          hover:text-slate-800 transition-colors">
        Close & Continue
      </button>
    </div>
  );
}

function spawnConfetti() {
  const colors = PALETTE.slice(0, 10);
  for (let i = 0; i < 50; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.left = `${Math.random() * 100}vw`;
    el.style.top = `${-Math.random() * 20}vh`;
    el.style.background = colors[i % colors.length];
    if (Math.random() > 0.5) {
      el.style.width = "12px";
      el.style.height = "12px";
    }
    el.style.animationDelay = `${Math.random() * 0.5}s`;
    el.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}
