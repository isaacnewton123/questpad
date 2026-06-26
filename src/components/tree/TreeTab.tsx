import type { GameState } from '../../types/tree';
import { PiCoinsFill, PiDropFill, PiVideoFill } from 'react-icons/pi';

export function TreeTab({ 
  gameState, uncollectedCoins, loading, handleClaim, handleWater, handleQuest, isAdPlaying 
}: { 
  gameState: GameState, 
  uncollectedCoins: number, 
  loading: boolean, 
  handleClaim: () => void, 
  handleWater: () => void,
  handleQuest: () => void,
  isAdPlaying: boolean
}) {
  const displayLevel = gameState.tree_level;

  return (
    <div className="h-full flex flex-col relative">
      <TreeStatusHeader displayLevel={displayLevel} gameState={gameState} />

      <div className="flex-1 flex flex-col items-center justify-end pb-8 relative">
        {uncollectedCoins > 0 && (
          <div className="absolute top-1/4 flex flex-col items-center transition-all z-20">
            <button onClick={handleClaim} disabled={loading} className="cursor-pointer bg-linear-to-r from-amber-400 to-orange-500 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-orange-500/30 border border-white/20 mb-1 animate-bounce hover:scale-105 active:scale-95 transition-transform flex items-center">
              <PiCoinsFill className="mr-1.5 text-lg" /><span>{uncollectedCoins.toFixed(2)}</span>
            </button>
          </div>
        )}
        <img src={`/trees/${displayLevel}.webp`} className={`h-64 md:h-80 object-contain z-10 transition-transform hover:scale-105 duration-300 drop-shadow-2xl ${displayLevel === 1 ? 'scale-75 origin-bottom' : ''} ${displayLevel === 6 ? 'tree-level-6' : ''}`} alt={`Tree Level ${displayLevel}`} />
        <div className="w-48 h-8 bg-black/10 rounded-[100%] blur-md -mt-6 z-0"></div>
      </div>

      <div className="flex gap-3 justify-center mt-auto mb-4 z-20 relative">
        <button onClick={handleQuest} disabled={loading || isAdPlaying || gameState.tree_ad_watches_today >= 5} className="flex-1 bg-linear-to-r from-slate-800 to-slate-900 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md active:scale-[0.98] transition-all flex flex-col items-center justify-center border border-slate-700 disabled:opacity-50">
          <div className="flex items-center text-sm">
            {isAdPlaying ? <span className="animate-spin mr-2">⏳</span> : <PiVideoFill className="mr-2" />} 
            {isAdPlaying ? 'Playing...' : 'Quest'}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] font-medium text-cyan-300 bg-cyan-900/40 px-2 py-0.5 rounded-full border border-cyan-700/50">+100 Water</span>
            <span className="text-[10px] font-medium text-slate-300 bg-slate-700/50 px-2 py-0.5 rounded-full">{gameState.tree_ad_watches_today || 0}/5</span>
          </div>
        </button>

        <button onClick={handleWater} disabled={loading || gameState.water_balance < 1} className="flex-1 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex flex-col items-center justify-center border border-white/20">
          <div className="flex items-center text-sm"><PiDropFill className="mr-2 text-lg" /> Water Tree</div>
          <span className="text-[10px] font-medium text-blue-100 bg-blue-900/20 px-2 py-0.5 rounded-full mt-1">Pour All</span>
        </button>
      </div>
    </div>
  );
}

function TreeStatusHeader({ displayLevel, gameState }: { displayLevel: number, gameState: GameState }) {
  const getWaterRequiredForLevel = (level: number) => {
    if (level === 1) return 200;
    if (level === 2) return 200;
    if (level === 3) return 400;
    if (level === 4) return 800;
    if (level === 5) return 1600;
    return 3200;
  };
  const waterRequired = getWaterRequiredForLevel(displayLevel);

  return (
    <div className="text-center z-10 pt-4">
      <h2 className="text-xl font-bold text-gradient">Level {displayLevel} Tree</h2>
      <div className="flex justify-center items-center mt-2">
        <div className="glass-panel px-4 py-1.5 flex items-center">
          <PiDropFill className="text-cyan-500 mr-2" />
          <div className="w-32 bg-slate-100/50 rounded-full h-2 overflow-hidden border border-slate-200/50">
            <div 
              className="bg-linear-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: displayLevel === 6 ? '100%' : `${Math.min(100, (gameState.tree_water / waterRequired) * 100)}%` }}
            ></div>
          </div>
          <span className="ml-3 text-xs font-bold text-slate-500">
            {displayLevel === 6 ? `${gameState.tree_water} Drops` : `${gameState.tree_water} / ${waterRequired}`}
          </span>
        </div>
      </div>
    </div>
  );
}
