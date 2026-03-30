"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResultDisplay from "@/components/ResultDisplay";

export default function ResultPage() {
  const router = useRouter();
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read result from sessionStorage — temporary, tab-scoped
    const result = sessionStorage.getItem("generationResult");

    if (!result) {
      // No result available — redirect to create page
      router.replace("/create");
      return;
    }

    setImageBase64(result);
    setIsLoading(false);

    // Clean up sessionStorage after reading
    // Result stays in component state for this page visit
    sessionStorage.removeItem("generationResult");
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center pt-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] pt-16">
      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Page header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Your Anime Portrait</h1>
          <p className="mt-2 text-white/50">
            Here&apos;s your AI-generated transformation
          </p>
        </div>

        {imageBase64 && <ResultDisplay imageBase64={imageBase64} />}
      </div>
    </main>
  );
}
