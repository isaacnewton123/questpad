import { createClient } from "@supabase/supabase-js";

const envUrl = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const url = envUrl.startsWith('/') && typeof window !== 'undefined'
  ? `${window.location.origin}${envUrl}`
  : envUrl;

export const supabase = createClient(url, key);
