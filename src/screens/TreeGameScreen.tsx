import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/useUser';
import { useTreeState } from '../hooks/tree/useTreeState';
import { useLeaderboard } from '../hooks/tree/useLeaderboard';
import { useTreeGameController } from '../hooks/tree/useTreeGameController';
import CheckInSuccessModal from '../components/quest/CheckInSuccessModal';
import { TreeTab } from '../components/tree/TreeTab';
import { PvpTab } from '../components/tree/PvpTab';
import { ShopTab } from '../components/tree/ShopTab';
import { LeaderboardTab } from '../components/tree/LeaderboardTab';
import type { GameState } from '../types/tree';
import { PiArrowLeftBold, PiCoinsFill, PiDropFill, PiTreeFill, PiCrosshairFill, PiStorefrontFill, PiRankingFill, PiStarFill } from 'react-icons/pi';
import { SiTon } from 'react-icons/si';

type Tab = 'tree' | 'pvp' | 'shop' | 'leaderboard';

export default function TreeGameScreen() {
  const navigate = useNavigate();
  const { user: profile } = useUser();
  const { gameState, uncollectedCoins } = useTreeState();
  const { leaderboard, seasonEnd, fetchLeaderboard } = useLeaderboard();
  const ctl = useTreeGameController();
  const [activeTab, setActiveTab] = useState<Tab>('tree');
  const [isScouting, setIsScouting] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (!gameState || !profile) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;

  return (
    <div className="max-w-md mx-auto min-h-dvh pb-nav pt-4 px-4 relative flex flex-col overflow-hidden text-slate-800">
      <div className="bg-animated" />
      {!isScouting && <TreeHeader profile={profile} gameState={gameState} leaderboard={leaderboard} onExit={() => navigate('/')} />}
      
      {ctl.toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 glass-panel px-4 py-2 text-slate-800 font-bold text-sm flex items-center shadow-lg transition-all animate-pulse border-blue-200">
          <PiDropFill className="mr-2 text-cyan-500" />
          {ctl.toastMessage}
        </div>
      )}

      <div className="flex-1 relative z-10 overflow-hidden mt-4 flex flex-col">
        {activeTab === 'tree' && <TreeTab gameState={gameState} uncollectedCoins={uncollectedCoins} loading={ctl.loading} handleClaim={ctl.handleClaim} handleWater={ctl.handleWater} handleQuest={ctl.handleQuest} isAdPlaying={ctl.isAdPlaying} />}
        {activeTab === 'pvp' && <PvpTab gameState={gameState} loading={ctl.loading} handleSearchPvp={ctl.searchPvp} handleSteal={ctl.handleSteal} onScoutChange={setIsScouting} />}
        {activeTab === 'shop' && <ShopTab gameState={gameState} loading={ctl.loading} handleBuyWater={ctl.handleBuyWater} />}
        {activeTab === 'leaderboard' && <LeaderboardTab leaderboard={leaderboard} profileId={profile.telegram_id} seasonEnd={seasonEnd} />}
      </div>
      
      {ctl.showAdSuccessModal && (
        <CheckInSuccessModal 
          onClose={() => ctl.setShowAdSuccessModal(false)} 
          rewardType="water" 
          rewardValue={100} 
        />
      )}
      
      {!isScouting && <TreeNav activeTab={activeTab} setActiveTab={setActiveTab} />}
    </div>
  );
}

import type { UserProfile } from '../context/UserContext';

import type { LeaderboardEntry } from '../types/tree';

function TreeHeader({ profile, gameState, leaderboard, onExit }: { profile: UserProfile, gameState: GameState, leaderboard: LeaderboardEntry[], onExit: () => void }) {
  const userRank = leaderboard.findIndex(u => u.telegram_id === profile.telegram_id) + 1;
  const rankText = userRank > 0 ? `#${userRank}` : 'Unranked';

  return (
    <header className="glass-panel px-3 py-3 z-20 flex justify-between items-center">
      <div className="flex items-center">
        <button onClick={onExit} className="mr-3 w-8 h-8 bg-slate-100 rounded-full text-slate-600 flex items-center justify-center hover:bg-slate-200 hover:text-slate-800 active:scale-95 transition-all">
          <PiArrowLeftBold />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center text-amber-500 font-bold text-[13px]">
          <PiCoinsFill className="mr-1" /><span>{Number(profile.coins || 0).toFixed(2)}</span>
        </div>
        <div className="flex items-center text-blue-500 font-bold text-[13px] mt-0.5">
          <SiTon className="mr-1.5" /><span>{Number(profile.ledger_ton || 0).toFixed(2)}</span>
        </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center text-cyan-500 font-bold text-[13px]">
          <PiDropFill className="mr-1" /><span>{gameState.water_balance}</span> Water
        </div>
        <div className="text-[11px] text-slate-400 font-medium mt-1 flex items-center bg-slate-100/50 px-2 py-0.5 rounded-full border border-slate-100">
          <PiStarFill className="text-amber-400 mr-1" /> Rank: {rankText}
        </div>
      </div>
    </header>
  );
}

function TreeNav({ activeTab, setActiveTab }: { activeTab: Tab, setActiveTab: (t: Tab) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-around items-center pb-safe pt-2 px-2 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        <button onClick={() => setActiveTab('tree')} className={`w-16 h-14 flex flex-col items-center justify-center transition-colors relative ${activeTab==='tree' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <PiTreeFill className={`text-[22px] mb-1 transition-transform duration-200 ${activeTab === 'tree' ? 'scale-110' : ''}`} /><span className="text-[10px] font-bold">Tree</span>
        </button>
        <button onClick={() => setActiveTab('pvp')} className={`w-16 h-14 flex flex-col items-center justify-center transition-colors relative ${activeTab==='pvp' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <PiCrosshairFill className={`text-[22px] mb-1 transition-transform duration-200 ${activeTab === 'pvp' ? 'scale-110' : ''}`} /><span className="text-[10px] font-bold">PvP</span>
        </button>
        <button onClick={() => setActiveTab('shop')} className={`w-16 h-14 flex flex-col items-center justify-center transition-colors relative ${activeTab==='shop' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <PiStorefrontFill className={`text-[22px] mb-1 transition-transform duration-200 ${activeTab === 'shop' ? 'scale-110' : ''}`} /><span className="text-[10px] font-bold">Shop</span>
        </button>
        <button onClick={() => setActiveTab('leaderboard')} className={`w-16 h-14 flex flex-col items-center justify-center transition-colors relative ${activeTab==='leaderboard' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <PiRankingFill className={`text-[22px] mb-1 transition-transform duration-200 ${activeTab === 'leaderboard' ? 'scale-110' : ''}`} /><span className="text-[10px] font-bold">Rank</span>
        </button>
      </div>
    </nav>
  );
}
