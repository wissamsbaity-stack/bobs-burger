import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseBrowserClient<Database>(url, key);
}
