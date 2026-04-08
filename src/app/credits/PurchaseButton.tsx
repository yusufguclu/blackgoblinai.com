"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface PurchaseButtonProps {
  packageId: string;
  packageName: string;
  credits: number;
  isLoggedIn: boolean;
}

interface ShopierFormData {
  actionUrl: string;
  fields: Record<string, string>;
}

export default function PurchaseButton({
  packageId,
  packageName,
  credits,
  isLoggedIn,
}: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [shopierForm, setShopierForm] = useState<ShopierFormData | null>(null);

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

      if (data.success && data.shopierForm) {
        // Set form data and submit to Shopier
        setShopierForm(data.shopierForm);
        // Wait for state to update, then submit the form
        setTimeout(() => {
          formRef.current?.submit();
        }, 100);
      } else {
        alert(data.error || "Purchase failed. Try again.");
        setLoading(false);
      }
    } catch {
      alert("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <>
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
            REDIRECTING TO PAYMENT...
          </span>
        ) : (
          `BUY ${packageName}`
        )}
      </button>

      {/* Hidden Shopier Payment Form */}
      {shopierForm && (
        <form
          ref={formRef}
          method="POST"
          action={shopierForm.actionUrl}
          style={{ display: "none" }}
        >
          {Object.entries(shopierForm.fields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}
    </>
  );
}
