"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResultDisplay from "@/components/ResultDisplay";

export default function ResultPage() {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read the url parameter from window.location directly
    // This avoids Next.js useSearchParams Suspense boundary requirements.
    const searchParams = new URLSearchParams(window.location.search);
    const urlParam = searchParams.get("url");

    if (!urlParam) {
      // Check legacy session storage just in case (optional, but let's just redirect)
      router.replace("/");
      return;
    }

    // Proxy the image URL through our backend to avoid CORS and load issues
    setImageSrc(`/api/image-proxy?url=${encodeURIComponent(urlParam)}`);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center pt-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-primary animate-spin" />
          <span className="font-headline font-black uppercase text-sm animate-pulse">
            LOADING CHAOS...
          </span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] pt-24 pb-12">
      <div className="mx-auto max-w-2xl px-6">
        {/* Page header */}
        <div className="mb-8 text-center">
          <h1 className="font-headline font-black text-4xl text-primary uppercase italic drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] meme-stroke tracking-tighter">
            YOUR CREATION
          </h1>
          <p className="mt-2 font-label font-bold text-sm uppercase text-on-surface">
            Here&apos;s your AI-generated transformation
          </p>
        </div>

        {imageSrc && <ResultDisplay imageSrc={imageSrc} />}
      </div>
    </main>
  );
}
