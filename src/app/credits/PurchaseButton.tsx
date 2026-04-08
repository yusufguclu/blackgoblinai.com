"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PurchaseButtonProps {
  packageId: string;
  packageName: string;
  credits: number;
  isLoggedIn: boolean;
}

export default function PurchaseButton({
  packageId,
  packageName,
  credits,
  isLoggedIn,
}: PurchaseButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="block w-full text-center bg-surface-container-high text-on-surface font-headline font-black text-xl py-4 border-4 border-black brutal-shadow-sm hover:scale-105 transition-transform uppercase italic"
      >
        LOGIN FIRST
      </Link>
    );
  }

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.refresh();
          setSuccess(false);
        }, 2000);
      } else {
        alert(data.error || "Purchase failed. Try again.");
      }
    } catch {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <button
        disabled
        className="w-full bg-tertiary text-white font-headline font-black text-xl py-4 border-4 border-black brutal-shadow-sm uppercase italic cursor-default flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
        +{credits} ADDED!
      </button>
    );
  }

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className={`w-full font-headline font-black text-xl py-4 border-4 border-black brutal-shadow hover:scale-105 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all uppercase italic cursor-pointer ${
        loading
          ? "bg-surface-container-high text-on-surface-variant opacity-60 cursor-wait"
          : "bg-[#FFFF00] text-black hover:bg-[#e6e600]"
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          PROCESSING...
        </span>
      ) : (
        `BUY ${packageName}`
      )}
    </button>
  );
}
