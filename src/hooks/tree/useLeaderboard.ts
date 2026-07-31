import { useState, useCallback } from 'react';
import { apiFetch } from '../../lib/api';
import type { LeaderboardEntry } from '../../types/tree';

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [seasonEnd, setSeasonEnd] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await apiFetch('/tree/leaderboard', 'GET');
      if (res.ok) {
        setLeaderboard((res.data as Record<string, unknown>).leaderboard as LeaderboardEntry[]);
        setSeasonEnd((res.data as Record<string, unknown>).season_end as string | null);
        setIsPaused((res.data as Record<string, unknown>).is_paused as boolean);
      } else {
        console.error('Failed to fetch leaderboard:', (res.data as Record<string, unknown>).error);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { leaderboard, seasonEnd, isPaused, fetchLeaderboard };
}
