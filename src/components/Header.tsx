"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/auth/actions";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const displayName =
    user?.user_metadata?.username ||
    user?.email?.split("@")[0] ||
    "MEMELORD";

  return (
    <header className="bg-[#343dff] dark:bg-[#343dff] flex justify-between items-center w-full px-3 py-3 md:px-6 md:py-4 sticky top-0 z-50 border-b-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-2 md:gap-8">
        <Link className="text-xl md:text-3xl font-black italic text-[#FFFF00] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] font-headline uppercase tracking-tighter truncate max-w-[140px] sm:max-w-none" href="/">Memelord.com</Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden lg:block relative">
          <input className="bg-surface-container-highest border-2 border-black px-4 py-1 font-bold text-sm focus:ring-0 focus:border-primary w-64 uppercase" placeholder="SEARCH FOR CHAOS..." type="text" />
        </div>

        {isLoading ? (
          // Skeleton while checking auth
          <div className="w-24 h-9 bg-white/20 border-2 border-black animate-pulse" />
        ) : user ? (
          // ── Authenticated ──
          <div className="flex gap-1 md:gap-2 items-center">
            <span className="hidden sm:block font-headline font-black text-[#FFFF00] text-xs md:text-sm uppercase truncate max-w-[120px]">
              {displayName}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="bg-secondary text-white font-headline font-bold uppercase tracking-tighter px-3 py-1.5 text-xs md:text-base md:px-6 md:py-2 border-2 border-black hover:scale-105 transition-transform active:translate-x-1 active:translate-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none whitespace-nowrap cursor-pointer"
              >
                SIGN OUT
              </button>
            </form>
          </div>
        ) : (
          // ── Not authenticated ──
          <div className="flex gap-1 md:gap-2">
            <Link href="/login" className="p-1.5 md:p-2 border-2 border-black bg-[#FFFF00] hover:bg-[#c00100] transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-black text-sm md:text-base">account_circle</span></Link>
            <Link href="/signup" className="bg-secondary text-white font-headline font-bold uppercase tracking-tighter px-3 py-1.5 text-xs md:text-base md:px-6 md:py-2 border-2 border-black hover:scale-105 transition-transform active:translate-x-1 active:translate-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none whitespace-nowrap inline-flex items-center justify-center">jOiN<span className="hidden sm:inline">&nbsp;nOw</span></Link>
          </div>
        )}
      </div>
    </header>
  );
}
