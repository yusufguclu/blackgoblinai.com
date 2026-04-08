"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CreditBalance() {
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      setIsLoggedIn(true);

      // Fetch credits
      fetch("/api/credits/balance")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setCredits(data.credits);
        })
        .finally(() => setIsLoading(false));
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setIsLoggedIn(false);
        setCredits(null);
      } else {
        setIsLoggedIn(true);
        fetch("/api/credits/balance")
          .then((res) => res.json())
          .then((data) => {
            if (data.success) setCredits(data.credits);
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Not logged in — show promo
  if (isLoggedIn === false) {
    return (
      <div className="bg-[#FFFF00] border-4 border-black p-4 brutal-shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="material-symbols-outlined text-black text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            stars
          </span>
          <span className="font-headline font-black uppercase text-sm text-black">
            FREE CREDITS
          </span>
        </div>
        <p className="text-xs font-bold text-black/70 uppercase leading-tight">
          Sign up now and get 3 free credits to start generating!
        </p>
        <Link
          href="/signup"
          className="block mt-3 w-full text-center bg-primary text-white font-headline font-black py-2 text-sm border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase italic"
        >
          CLAIM FREE CREDITS →
        </Link>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-surface-container border-4 border-black p-4 brutal-shadow-sm animate-pulse">
        <div className="h-4 bg-surface-container-high w-24 mb-3" />
        <div className="h-8 bg-surface-container-high w-16 mb-3" />
        <div className="h-8 bg-surface-container-high w-full" />
      </div>
    );
  }

  // Logged in — show balance
  const isLow = credits !== null && credits <= 3;
  const isEmpty = credits !== null && credits === 0;

  return (
    <div
      className={`border-4 border-black p-4 brutal-shadow-sm ${
        isEmpty
          ? "bg-error-container"
          : isLow
          ? "bg-[#FFFF00]"
          : "bg-tertiary-container"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-headline font-black uppercase text-xs text-black/60">
          YOUR CREDITS
        </span>
        <span
          className="material-symbols-outlined text-xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          toll
        </span>
      </div>

      <div className="font-headline font-black text-4xl text-black leading-none mb-1">
        {credits ?? 0}
      </div>

      {isEmpty && (
        <p className="text-[10px] font-bold uppercase text-on-error-container mb-2">
          ⚠ NO CREDITS LEFT! BUY MORE TO CONTINUE
        </p>
      )}

      {isLow && !isEmpty && (
        <p className="text-[10px] font-bold uppercase text-black/60 mb-2">
          ⚡ RUNNING LOW! GET MORE CREDITS
        </p>
      )}

      {!isLow && (
        <p className="text-[10px] font-bold uppercase text-black/60 mb-2">
          1 CREDIT = 1 GENERATION
        </p>
      )}

      <Link
        href="/credits"
        className={`block w-full text-center font-headline font-black py-2 text-sm border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase italic ${
          isEmpty || isLow
            ? "bg-secondary text-white animate-pulse hover:animate-none"
            : "bg-primary text-white"
        }`}
      >
        {isEmpty ? "BUY CREDITS NOW" : isLow ? "GET MORE CREDITS" : "BUY CREDITS"}
      </Link>
    </div>
  );
}
