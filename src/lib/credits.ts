/**
 * Credit System — Server-side helpers
 *
 * Provides functions to read, deduct, and add credits to a user's profile.
 */

import { createClient } from "@/lib/supabase/server";

// ── Credit Packages ──────────────────────────────────────────

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;           // USD cents
  priceDisplay: string;    // e.g. "$4.99"
  popular?: boolean;
  description: string;
  perks: string[];
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter",
    name: "NOOB PACK",
    credits: 10,
    price: 14999,
    priceDisplay: "₺149.99",
    description: "Just dipping your toes into the meme abyss.",
    perks: [
      "10 AI generations",
      "All styles unlocked",
      "Standard speed",
    ],
  },
  {
    id: "pro",
    name: "DANK LORD",
    credits: 50,
    price: 44999,
    priceDisplay: "₺449.99",
    popular: true,
    description: "The chosen one. Peak meme productivity.",
    perks: [
      "50 AI generations",
      "All styles unlocked",
      "Priority speed",
      "Save 40% per credit",
    ],
  },
  {
    id: "ultra",
    name: "GIGA CHAD",
    credits: 200,
    price: 119999,
    priceDisplay: "₺1199.99",
    description: "Unlimited power? Almost. 200 credits of raw chaos.",
    perks: [
      "200 AI generations",
      "All styles unlocked",
      "Fastest speed",
      "Save 60% per credit",
      "Early access to new styles",
    ],
  },
];

// ── Credit Queries ───────────────────────────────────────────

export async function getUserCredits(): Promise<number | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;
  return data.credits;
}

export async function deductCredit(userId: string): Promise<boolean> {
  const supabase = await createClient();

  // Atomic decrement — only if credits > 0
  const { error } = await supabase.rpc("deduct_credit", {
    p_user_id: userId,
  });

  return !error;
}

export async function addCredits(
  userId: string,
  amount: number
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.rpc("add_credits", {
    p_user_id: userId,
    p_amount: amount,
  });

  return !error;
}
