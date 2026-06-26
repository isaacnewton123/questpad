import { useState, useEffect, useMemo } from 'react';
import { useUser } from '../../context/useUser';

export function useTreeState() {
  const { user: profile } = useUser();
  const [uncollectedCoins, setUncollectedCoins] = useState(0);

  const gameState = useMemo(() => {
    return profile ? {
      tree_level: profile.tree_level ?? 1,
      tree_water: profile.tree_water ?? 0,
      water_balance: profile.water_balance ?? 0,
      last_tree_claim_at: profile.last_tree_claim_at ?? new Date().toISOString(),
      pvp_steals_today: profile.pvp_steals_today ?? 0,
      pvp_steals_reset_at: profile.pvp_steals_reset_at ?? new Date().toISOString(),
      shop_water_bought_today: profile.shop_water_bought_today ?? 0,
      tree_ad_watches_today: profile.tree_ad_watches_today ?? 0,
      tree_ad_watches_reset_at: profile.tree_ad_watches_reset_at ?? new Date().toISOString(),
    } : null;
  }, [profile]);

  useEffect(() => {
    if (!gameState) return;
    const interval = setInterval(() => {
      const lastClaim = new Date(gameState.last_tree_claim_at).getTime();
      const hoursPassed = (new Date().getTime() - lastClaim) / 3600000;
      const dailyRate = 5 * Math.pow(2, Math.min(gameState.tree_level, 6));
      
      let calculated = hoursPassed * (dailyRate / 24);
      if (calculated > dailyRate * 2) calculated = dailyRate * 2;
      
      setUncollectedCoins(Math.max(0, calculated));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  return { gameState, uncollectedCoins };
}
