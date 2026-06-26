import { useState } from 'react';
import type { GameState, PvpResult } from '../../types/tree';
import { PiLightningFill, PiMagnifyingGlassBold, PiCoinsFill, PiArrowLeftBold, PiCrosshairFill, PiBroadcastFill, PiDetectiveFill } from 'react-icons/pi';

export function PvpTab({
  gameState, loading, handleSearchPvp, handleSteal, onScoutChange
}: {
  gameState: GameState; loading: boolean;
  handleSearchPvp: (q: string) => Promise<{error?: string, results?: PvpResult[]}>;
  handleSteal: (targetId: number) => void;
  onScoutChange?: (isScouting: boolean) => void;
}) {
  const [query, setQuery] = useState('');
  const [pvpResults, setPvpResults] = useState<PvpResult[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<PvpResult | null>(null);
  const [showTargetTree, setShowTargetTree] = useState(false);

  const onSearch = async () => {
    if (query.trim().length < 3) return; // Enforce minimum 3 characters
    const res = await handleSearchPvp(query);
    if (res?.results && res.results.length > 0) {
      setPvpResults(res.results);
    } else {
      setPvpResults([]);
    }
  };

  const handleShowTargetTree = (show: boolean) => {
    setShowTargetTree(show);
    onScoutChange?.(show);
  };

  const onSteal = async () => {
    if (!selectedTarget) return;
    await handleSteal(selectedTarget.target_id);
    handleShowTargetTree(false);
    setSelectedTarget(null);
  };

  if (showTargetTree && selectedTarget) {
    return <TargetTree result={selectedTarget} gameState={gameState} loading={loading} onSteal={onSteal} onBack={() => handleShowTargetTree(false)} />;
  }

  return (
    <div className="h-full flex flex-col">
      <PvpHeader />
      <div className="flex-1 p-4 flex flex-col overflow-y-auto no-scrollbar">
        <PvpEnergy energy={3 - gameState.pvp_steals_today} />
        
        <div className="step-card mb-4">
          <h3 className="font-bold text-slate-800 text-[13px] mb-2">Search Target Username</h3>
          <div className="flex gap-2">
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" placeholder="E.g. CryptoBoy..."/>
            <button onClick={onSearch} disabled={loading} className="shrink-0 bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-xl text-[13px] font-bold flex items-center shadow-sm active:scale-95 transition-transform"><PiMagnifyingGlassBold className="mr-1" /> Search</button>
          </div>
        </div>

        <PvpSearchResult results={pvpResults} onScout={(r) => { setSelectedTarget(r); handleShowTargetTree(true); }} query={query} />
      </div>
    </div>
  );
}

function PvpHeader() {
  return (
    <div className="text-center z-10 pt-4 pb-2">
      <h2 className="text-xl font-bold text-gradient flex justify-center items-center gap-2"><PiCrosshairFill className="text-red-500" /> PvP Area</h2>
      <p className="text-xs text-slate-500 mt-1">Search and steal from AFK players!</p>
    </div>
  );
}

function PvpEnergy({ energy }: { energy: number }) {
  return (
    <div className="glass-panel p-3 mb-4 flex justify-between items-center">
      <span className="font-bold text-slate-700 text-[13px] flex items-center"><PiLightningFill className="text-amber-500 mr-1" /> Energy Left:</span>
      <span className="font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 text-[13px]">{energy} / 3</span>
    </div>
  );
}

function PvpSearchResult({ results, onScout, query }: { results: PvpResult[], onScout: (r: PvpResult) => void, query: string }) {
  if (results.length > 0) {
    return (
      <div className="flex flex-col gap-3">
        {results.map((result) => (
          <div key={result.target_id} className="step-card flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-800 text-[13px]">{result.username}</h4>
              <p className="text-[11px] text-slate-500">AFK: {result.hours_afk} hours</p>
            </div>
            <button onClick={() => onScout(result)} className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg text-[13px] font-bold hover:bg-red-100 active:scale-95 transition-transform">Scout</button>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col items-center justify-center opacity-40 pb-10 mt-6">
      <PiBroadcastFill className="text-6xl text-slate-300 mb-3" />
      <p className="text-[12px] font-medium text-slate-400 text-center px-8">
        {query.length > 0 && query.length < 3 ? 'Search must be at least 3 characters.' : 'Type a username to scan for vulnerabilities.'}
      </p>
    </div>
  );
}

function TargetTree({ result, gameState, loading, onSteal, onBack }: { result: PvpResult, gameState: GameState, loading: boolean, onSteal: () => void, onBack: () => void }) {
  return (
    <div className="h-full flex flex-col relative bg-slate-50/50">
      <div className="p-4 flex items-center justify-between z-20">
        <button onClick={onBack} className="bg-white px-3 py-1.5 rounded-lg shadow-sm text-slate-600 hover:text-slate-800 active:scale-95 transition-transform font-bold text-[13px] border border-slate-200 flex items-center"><PiArrowLeftBold className="mr-1" /> Back</button>
        <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm font-bold text-[13px] text-slate-700 border border-slate-200 flex items-center"><PiDetectiveFill className="text-slate-400 mr-2 text-lg" /> Target: <span className="ml-1 text-slate-800">{result.username}</span></div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-end pb-8 relative">
        <div className="absolute top-4 w-full px-8 z-20 flex justify-center">
          <div className="glass-panel text-slate-600 text-xs px-4 py-1.5 rounded-full font-medium flex items-center">
            Last Active: <span className="text-red-500 font-bold ml-1">{result.hours_afk}h ago</span>
          </div>
        </div>

        <div className="absolute top-1/4 flex flex-col items-center transition-all z-20">
          <button onClick={onSteal} disabled={loading || gameState.pvp_steals_today >= 3} className="bg-linear-to-r from-red-500 to-rose-600 text-white text-xl font-black px-6 py-3 rounded-full shadow-lg shadow-red-500/20 border border-white/20 mb-2 animate-bounce flex items-center hover:scale-105 active:scale-95 transition-transform cursor-pointer">
            <PiCoinsFill className="mr-2 text-yellow-300 text-2xl" /><span>{Math.floor(result.uncollected_coins * 0.05)} - {Math.ceil(result.uncollected_coins * 0.15)}</span>
          </button>
        </div>
        <img src="/trees/1.webp" className="h-64 md:h-80 object-contain scale-75 origin-bottom z-10 filter grayscale-50 contrast-110 drop-shadow-2xl" alt="Target Tree"/>
        <div className="w-48 h-8 bg-black/10 rounded-[100%] blur-md -mt-6 z-0"></div>
      </div>
    </div>
  );
}
