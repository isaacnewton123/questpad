import { useContext, createContext } from "react";
import type { UserProfile } from "./UserContext";

interface UserContextValue {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
  error: null,
  refetchUser: async () => {},
});

export function useUser() {
  return useContext(UserContext);
}
