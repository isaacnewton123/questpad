import { useState } from 'react';
import { useUser } from '../../context/useUser';
import type { PvpResult } from '../../types/tree';
import { apiFetch } from '../../lib/api';

export function useTreePvpActions() {
  const { refetchUser: refreshUser } = useUser();
  const [loading, setLoading] = useState(false);

  const searchPvp = async (username: string): Promise<{error?: string, results?: PvpResult[]}> => {
    setLoading(true);
    try {
      const res = await apiFetch(`/tree/search?q=${encodeURIComponent(username)}`, "GET");
      if (!res.ok) throw new Error((res.data as Record<string, unknown>).error as string || "Search failed");
      return { results: (res.data as Record<string, unknown>).results as PvpResult[] };
    } catch (e: unknown) {
      return { error: (e as Error).message };
    } finally {
      setLoading(false);
    }
  };

  const stealCoins = async (targetId: number) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/tree/steal`, "POST", { targetId });
      if (!res.ok) throw new Error((res.data as Record<string, unknown>).error as string || "Steal failed");
      await refreshUser();
      return { success: true, data: res.data };
    } catch (e: unknown) {
      return { success: false, error: (e as Error).message };
    } finally {
      setLoading(false);
    }
  };

  return { loading, searchPvp, stealCoins };
}
