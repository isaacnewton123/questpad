import { useState, useCallback } from 'react';
import { apiFetch } from '../../lib/api';
import type { LeaderboardEntry } from '../../types/tree';

export interface LeaderboardWinner {
  rank: number;
  reward_ton: number;
  users: {
    username: string;
    telegram_id: number;
  };
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [seasonEnd, setSeasonEnd] = useState<string | null>(null);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [latestWinners, setLatestWinners] = useState<LeaderboardWinner[]>([]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await apiFetch('/tree/leaderboard', 'GET');
      if (res.ok) {
        setLeaderboard((res.data as Record<string, unknown>).leaderboard as LeaderboardEntry[]);
        setSeasonEnd((res.data as Record<string, unknown>).season_end as string | null);
        setIsEnded((res.data as Record<string, unknown>).is_ended as boolean);
        setLatestWinners((res.data as Record<string, unknown>).latest_winners as LeaderboardWinner[]);
      } else {
        console.error('Failed to fetch leaderboard:', (res.data as Record<string, unknown>).error);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { leaderboard, seasonEnd, isEnded, latestWinners, fetchLeaderboard };
}
