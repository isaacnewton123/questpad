import { PiSpinnerBallFill, PiTreeFill, PiGameController } from "react-icons/pi";
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

      <div className="flex flex-col gap-4">
        <GameCard
          title="Spin Wheel"
          description="Spin the lucky wheel daily to earn TON, Coins, and Power-ups."
          icon={<PiSpinnerBallFill className="text-blue-500" />}
          path="/game/spin"
          isNew={false}
        />
        
        <GameCard
          title="Forest Minigame"
          description="Plant trees, water them, and steal resources from other players! Coming soon."
          icon={<PiTreeFill className="text-emerald-500" />}
          path="/game/trees"
          isNew={true}
          disabled={true}
        />
      </div>
    </div>
  );
}

function GameCard({
  title, description, icon, path, isNew, disabled
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  isNew: boolean;
  disabled?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      disabled={disabled}
      className={`relative w-full text-left p-5 rounded-2xl border ${
        disabled 
          ? "bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed" 
          : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98]"
      } transition-all duration-300`}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-slate-50 rounded-xl text-3xl">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
            {isNew && (
              <span className="px-2 py-0.5 bg-linear-to-r from-emerald-400 to-emerald-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                Soon
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 leading-snug mt-1">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
