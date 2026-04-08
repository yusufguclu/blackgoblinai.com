/**
 * Supabase Browser Client
 *
 * Used in Client Components (components with "use client" directive).
 * Creates a singleton browser client that handles auth state automatically.
 */

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
