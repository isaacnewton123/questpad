import { useState, useEffect, useCallback, type ReactNode } from "react";
import { apiFetch } from "../lib/api";
import { UserContext } from "./useUser";

export interface UserProfile {
  telegram_id: number;
  username: string;
  wallet_address: string | null;
  ledger_ton: number;
  coins: number;
  is_verified: boolean;
  has_adblocker: boolean;
  bonus_spins: number;
  referrer_id: number | null;
  last_spin_at: string | null;
  spin_streak: number;
  created_at: string;
}

interface AuthResponse {
  user: UserProfile;
  isNew: boolean;
  error?: string;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const res = await apiFetch<AuthResponse>("/auth/verify", "POST");
      if (res.ok && res.data.user) {
        setUser(res.data.user);
      }
    } catch {
      console.warn("Background user fetch failed");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const res = await apiFetch<AuthResponse>("/auth/verify", "POST");
        if (cancelled) return;
        if (res.ok && res.data.user) {
          setUser(res.data.user);
        } else {
          setError(res.data.error ?? "Authentication failed");
        }
      } catch {
        if (!cancelled) setError("Network error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, error, refetchUser: fetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
}
