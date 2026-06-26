export interface GameState {
  tree_level: number;
  tree_water: number;
  water_balance: number;
  last_tree_claim_at: string;
  pvp_steals_today: number;
  pvp_steals_reset_at: string;
  shop_water_bought_today: number;
  tree_ad_watches_today: number;
  tree_ad_watches_reset_at: string;
}

export interface PvpResult {
  target_id: number;
  username: string;
  uncollected_coins: number;
  hours_afk: number;
}

export interface LeaderboardEntry {
  telegram_id: number;
  username: string;
  tree_level: number;
  tree_water: number;
}
