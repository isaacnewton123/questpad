import { useState } from 'react';
import { useUser } from '../../context/useUser';
import { apiFetch } from '../../lib/api';

export function useTreeCoreActions() {
  const { refetchUser: refreshUser } = useUser();
  const [loading, setLoading] = useState(false);

  const exec = async (endpoint: string, payload?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/tree${endpoint}`, payload ? "POST" : "GET", payload);
      if (!res.ok) throw new Error((res.data as Record<string, unknown>).error as string || "API request failed");
      
      await refreshUser();
      return { success: true, data: res.data };
    } catch (e: unknown) {
      return { success: false, error: (e as Error).message };
    } finally {
      setLoading(false);
    }
  };

  const claimCoins = async () => {
    const res = await exec('/claim', {});
    if (!res.success) return { success: false, error: res.error };
    
    const typedData = res.data as { amount?: number };
    return { 
      success: true, 
      amount: typedData.amount, 
      error: null 
    };
  };

  const waterTree = () => exec('/water', {});
  const buyWater = () => exec('/buy-water', {});

  return { loading, claimCoins, waterTree, buyWater };
}
