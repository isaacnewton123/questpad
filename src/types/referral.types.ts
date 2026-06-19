export interface Friend {
  username: string;
  is_qualified: boolean;
  joined_at: string;
}

export interface LeaderboardEntry {
  telegram_id: number;
  username: string;
  qualified_count: number;
}
