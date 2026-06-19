import { useRef, useEffect, useState } from "react";
import { SiTon } from "react-icons/si";
import { PiCoinsFill } from "react-icons/pi";
import { FaGhost } from "react-icons/fa6";

const PALETTE = [
  "#FF7675", "#74B9FF", "#FDCB6E", "#A29BFE",
  "#00CEC9", "#FF9FF3", "#FAB1A0", "#81ECEC",
  "#FFEAA7", "#6C5CE7", "#E17055", "#00B894",
];

export interface WheelSegment {
  label: string;
  type: string;
  value: number;
  color?: string;
}

interface SpinWheelProps {
  segments: WheelSegment[];
  spinning: boolean;
  targetIndex: number | null;
  onSpinEnd: (index: number) => void;
}

export function PrizeIcon({ type, value, size = 24, className = "" }: { type: string, value: number, size?: number, className?: string }) {
  if (value === 0) return <FaGhost size={size} className={className} />;
  if (type === "ton") return <SiTon size={size} className={className} color="#0098EA" />;
  return <PiCoinsFill size={size} className={className} color="#F59E0B" />;
}

export default function SpinWheel({
  segments, spinning, targetIndex, onSpinEnd,
}: SpinWheelProps) {
  const angleRef = useRef(0);
  const spinningRef = useRef(false);
  const [pointerTick, setPointerTick] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!spinning || targetIndex === null || spinningRef.current) return;
    spinningRef.current = true;
    runSpinAnimation(
      segments, targetIndex, angleRef,
      setRotation, setPointerTick, (idx) => {
        spinningRef.current = false;
        onSpinEnd(idx);
      }
    );
  }, [spinning, targetIndex, segments, onSpinEnd]);

  return (
    <div className="flex flex-col items-center w-full max-w-[240px] mx-auto">
      <Pointer ticking={pointerTick} onTickEnd={() => setPointerTick(false)} />
      <div className="relative w-full aspect-square" style={{
        filter: "drop-shadow(0 24px 32px rgba(15,23,42,0.12))",
      }}>
        <div className="absolute inset-0 rounded-full border-[6px] border-white z-10 pointer-events-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.15)]" />
        <WheelSegments segments={segments} rotation={rotation} />
        <Hub />
      </div>
    </div>
  );
}

function WheelSegments({ segments, rotation }: { segments: WheelSegment[], rotation: number }) {
  const gradientParts = segments.map((seg, i) => {
    const startDeg = (i * 360) / segments.length;
    const endDeg = ((i + 1) * 360) / segments.length;
    const color = seg.color ?? PALETTE[i % PALETTE.length];
    return `${color} ${startDeg}deg ${endDeg}deg`;
  }).join(", ");

  return (
    <div 
      className="w-full h-full rounded-full overflow-hidden absolute inset-0 transition-transform will-change-transform"
      style={{ 
        background: `conic-gradient(${gradientParts})`,
        transform: `rotate(${rotation}rad)`
      }}
    >
      {segments.map((seg, i) => (
        <WheelSlice key={i} seg={seg} index={i} total={segments.length} />
      ))}
      <div className="absolute inset-0 bg-linear-to-b from-white/30 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
}

function WheelSlice({ seg, index, total }: { seg: WheelSegment, index: number, total: number }) {
  const angleDeg = (index + 0.5) * (360 / total);
  return (
    <div
      className="absolute top-0 left-0 w-full h-full flex justify-center pt-4 drop-shadow-md"
      style={{ transform: `rotate(${angleDeg}deg)` }}
    >
      <div className="flex flex-col items-center text-white">
        <PrizeIcon type={seg.type} value={seg.value} size={24} />
        {seg.value > 0 && <span className="font-bold text-sm mt-1 tracking-tight" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>{seg.value}</span>}
      </div>
    </div>
  );
}

function Pointer({ ticking, onTickEnd }: {
  ticking: boolean; onTickEnd: () => void;
}) {
  return (
    <div
      className={`relative z-30 -mb-4 flex flex-col items-center ${ticking ? "pointer-tick" : ""}`}
      style={{
        filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.2))",
        transformOrigin: "top center",
      }}
      onAnimationEnd={onTickEnd}
    >
      <svg viewBox="0 0 40 46" fill="none" width="30" height="34">
        <path
          d="M20 45L5 15C-2 4 6 0 20 0C34 0 42 4 35 15L20 45Z"
          fill="url(#pg)" stroke="#fff" strokeWidth="2"
        />
        <circle cx="20" cy="12" r="4" fill="#fff" opacity="0.8" />
        <defs>
          <linearGradient id="pg" x1="0" y1="0" x2="40" y2="46"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E293B" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Hub() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      w-10 h-10 rounded-full z-20 flex items-center justify-center
      border-[3px] border-white"
      style={{
        background: "linear-gradient(135deg, #fff, #e2e8f0)",
        boxShadow: "0 10px 20px rgba(0,0,0,0.15), inset 0 -4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div className="w-5 h-5 rounded-full"
        style={{
          background: "linear-gradient(135deg, #cbd5e1, #94a3b8)",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
}

function runSpinAnimation(
  segments: WheelSegment[],
  targetIndex: number,
  angleRef: React.MutableRefObject<number>,
  draw: (a: number) => void,
  setTick: (v: boolean) => void,
  onEnd: (idx: number) => void
) {
  const n = segments.length;
  const arc = (2 * Math.PI) / n;
  const targetAngle = -(targetIndex * arc + arc / 2);
  const fullSpins = (8 + Math.floor(Math.random() * 4)) * 2 * Math.PI;
  const totalSpin = fullSpins + targetAngle - (angleRef.current % (2 * Math.PI));
  const duration = 5000 + Math.random() * 1500;
  const startAngle = angleRef.current;
  const startTime = performance.now();
  let lastSlice = -1;

  function easeOut(t: number) {
    return 1 - Math.pow(1 - t, 4.5);
  }

  function step(now: number) {
    const t = Math.min((now - startTime) / duration, 1);
    const current = startAngle + totalSpin * easeOut(t);
    angleRef.current = current;
    draw(current);

    const norm = ((-current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const slice = Math.floor(norm / arc);
    if (slice !== lastSlice && t > 0.02 && t < 0.99) {
      setTick(true);
      lastSlice = slice;
    }

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      angleRef.current = current % (2 * Math.PI);
      onEnd(targetIndex);
    }
  }

  requestAnimationFrame(step);
}
