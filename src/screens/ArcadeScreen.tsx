import { PiGameController } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export default function ArcadeScreen() {
  return (
    <div className="flex flex-col gap-6 pt-4 pb-nav px-4 max-w-md mx-auto">
      <div className="bg-animated" />
      <header className="text-center mb-1">
        <h1 className="text-2xl font-bold text-gradient flex items-center justify-center gap-2">
          <PiGameController /> Games Arcade
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Play minigames to earn resources
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <GameCard
          title="Spin Wheel"
          description="Spin the lucky wheel daily to earn rewards."
          image="/arcade/spin-wheel.webp"
          path="/game/spin"
          isNew={false}
        />
        
        <GameCard
          title="Trees Forest"
          description="Plant trees and steal resources!"
          image="/arcade/forest.webp"
          path="/game/trees"
          isNew={true}
          disabled={true}
        />
      </div>
    </div>
  );
}

function GameCard({
  title, description, image, path, isNew, disabled
}: {
  title: string;
  description: string;
  image: string;
  path: string;
  isNew: boolean;
  disabled?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      disabled={disabled}
      className={`relative w-full aspect-square text-left rounded-2xl border overflow-hidden flex flex-col ${
        disabled 
          ? "bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed" 
          : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98]"
      } transition-all duration-300`}
    >
      <div className="w-full h-[55%] relative bg-slate-100/50 border-b border-slate-100 p-2 flex items-center justify-center">
        <img src={image} alt={title} className="w-full h-full object-contain drop-shadow-sm" />
      </div>
      <div className="flex-1 p-3 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 mb-1">
          <h3 className="font-bold text-slate-800 text-[13px] truncate">{title}</h3>
          {isNew && (
            <span className="px-1.5 py-0.5 bg-linear-to-r from-emerald-400 to-emerald-500 text-white text-[8px] font-bold rounded-sm uppercase tracking-wider">
              SOON
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 leading-tight line-clamp-2">
          {description}
        </p>
      </div>
    </button>
  );
}
