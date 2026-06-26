import type { GameState } from '../../types/tree';
import { PiStorefrontFill, PiCoinsFill, PiDropFill } from 'react-icons/pi';

export function ShopTab({ gameState, loading, handleBuyWater }: { gameState: GameState, loading: boolean, handleBuyWater: () => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="text-center z-10 pt-4 pb-2">
        <h2 className="text-xl font-bold text-gradient flex justify-center items-center gap-2"><PiStorefrontFill className="text-blue-500" /> Items Shop</h2>
        <p className="text-xs text-slate-500 mt-1">Exchange your coins for items!</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto no-scrollbar mt-2">
        <div className="campaign-card flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-cyan-50 p-3 rounded-xl mr-3 border border-cyan-100"><PiDropFill className="text-cyan-500 text-2xl" /></div>
            <div>
              <h3 className="font-bold text-slate-800 text-[14px]">Water Pack (100)</h3>
              <p className="text-[11px] text-slate-500 mb-1">
                Limit: <span className="font-bold text-blue-600">{gameState.shop_water_bought_today}/1</span> Today
              </p>
              <div className="flex items-center text-amber-500 font-bold text-[13px] bg-amber-50 w-fit px-2 py-0.5 rounded-md border border-amber-100">
                <PiCoinsFill className="mr-1" /> 500
              </div>
            </div>
          </div>
          <button onClick={handleBuyWater} disabled={loading || gameState.shop_water_bought_today >= 1} className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white px-5 py-2 rounded-xl text-[13px] font-bold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed">
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
