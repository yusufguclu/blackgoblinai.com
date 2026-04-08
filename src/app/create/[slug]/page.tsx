"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import type { ApiGenerateResponse, ApiStatusResponse } from "@/types";

const filterData: Record<string, {name: string, image: string}> = {
  "bust-down": {
    name: "Bust Down Filter",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaA4Vl9AfG-6CDZdjKvHgGJAJcNyVvaSYhJo9dWop2gFJffBHaILFzNLujCMpj9593EHUPZi1-c_BeKmFYcRCGZHrJo7SdSJrbWJ7CRQellx7dS0LKjJSv1L7obW6tGujvBFkDMvMZH9moKO_xP6m9lhUSyqhg-nK6ymBExSCf88Vs-BNXG7PgDTenfcrqV_L7Qm0oZYp7kTDSx8lftlydf5WMHt_5eDCVkIi5dDW4F3NhdHwr5czXuL90SAoWM4oQrt_Q5mL25yON",
  },
  "gigachad": {
    name: "Gigachad Meme Maker",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtuQWOW6oexgmDYwRLTeCBjLlYx5W0HraPe1atUjsrtbVi4EBGmrjROmZ1zQ4qEkIECWtmE5mOlh4DZWjlaN7C2RPvh0vtVMNfWLfAtu6K_O04jPEaE6CdPUnqz0xEEKlZ1DDXBVQieSW7lq2QxOwqO9tHs0XcFZS1zyvkifz_hc5DmAkqmHL32uNumURHGO8HZCeiQe5LTSrci0esTfkxVl3J40_y-SwE7mdTicSING0w9uKVchD3BAd6Rz0XJ3Zo7PbBTtVQP-Vy",
  },
  "face-swap": {
    name: "JD Vance Face Swap",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBw8QtVF4NC11XiPVZNCxu328N1xygUL2mmqRKfTnW-ivaAXcTsOAGhd62R_EunvgYMEiiRq-3ZCQqkTuQcwja5PH_zNJlfa84AujdLPuBktS3k4WhKA1HNwkQtsJjkbNuCJGiQhi2186jmcXIpkqkFbcK-WCO6dlnQxUc1FG4sPVA_5oLo_Rdzk7mjXvVUQLGeLs4ym1N7GEcqyim-03zQU0dXlSzHd4oqfc3_M1WUUx4yVkt5AArIb4dlY8jOl7U3484PFdYT1Yvj",
  },
  "anime-character": {
    name: "Anime Character",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaA4Vl9AfG-6CDZdjKvHgGJAJcNyVvaSYhJo9dWop2gFJffBHaILFzNLujCMpj9593EHUPZi1-c_BeKmFYcRCGZHrJo7SdSJrbWJ7CRQellx7dS0LKjJSv1L7obW6tGujvBFkDMvMZH9moKO_xP6m9lhUSyqhg-nK6ymBExSCf88Vs-BNXG7PgDTenfcrqV_L7Qm0oZYp7kTDSx8lftlydf5WMHt_5eDCVkIi5dDW4F3NhdHwr5czXuL90SAoWM4oQrt_Q5mL25yON",
  },
};

const PROGRESS_MESSAGES = [
  "Starting AI model...",
  "Uploading image to GPU cluster...",
  "Model is processing your image...",
  "Neural networks doing their thing...",
  "Still cooking... this model is thorough...",
  "Almost there, finalizing output...",
  "Downloading result from the cloud...",
];

const POLL_INTERVAL = 3000;
const MAX_POLL_TIME = 180_000; // 3 minutes

export default function CreateSlugPage() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) || "bust-down";
  
  const currentFilter = filterData[slug] || filterData["bust-down"];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [noCredits, setNoCredits] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [progressMessage, setProgressMessage] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef(false);

  // Fetch credit balance on mount
  useEffect(() => {
    fetch("/api/credits/balance")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCreditsRemaining(data.credits);
      })
      .catch(() => {});
  }, []);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Cycle through progress messages
  useEffect(() => {
    if (!isGenerating) return;
    const idx = Math.min(
      Math.floor(elapsedSeconds / 8),
      PROGRESS_MESSAGES.length - 1
    );
    setProgressMessage(PROGRESS_MESSAGES[idx]);
  }, [isGenerating, elapsedSeconds]);

  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    setSelectedFile(file);
    setGenerateError(null);

    const url = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleGenerate = async () => {
    if (!selectedFile) {
      setUploadError("Please upload an image first.");
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);
    setNoCredits(false);
    setElapsedSeconds(0);
    setProgressMessage(PROGRESS_MESSAGES[0]);
    abortRef.current = false;

    // Start elapsed timer
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    try {
      // Step 1: Submit generation request (async mode — returns taskId)
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("styleSlug", slug);
      formData.append("mode", "async");

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success || !data.taskId) {
        if (data.code === "NO_CREDITS") {
          setNoCredits(true);
        }
        setGenerateError(data.error ?? "Failed to start generation.");
        setIsGenerating(false);
        stopPolling();
        return;
      }

      // Update credits display after successful deduction
      if (typeof data.creditsRemaining === "number") {
        setCreditsRemaining(data.creditsRemaining);
      }

      // Step 2: Poll for status
      const taskId = data.taskId;
      setProgressMessage("Model run started, polling for results...");

      const pollForResult = () => {
        pollRef.current = setInterval(async () => {
          if (abortRef.current) {
            stopPolling();
            return;
          }

          // Timeout check
          if (Date.now() - startTime > MAX_POLL_TIME) {
            stopPolling();
            setGenerateError("Generation timed out. Please try again.");
            setIsGenerating(false);
            return;
          }

          try {
            const statusRes = await fetch("/api/generate/status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ taskId }),
            });

            const status: ApiStatusResponse = await statusRes.json();

            if (status.completed) {
              stopPolling();

              if (status.imageUrl) {
                // Redirect with URL passed as query parameter
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                router.push(`/result?url=${encodeURIComponent(status.imageUrl)}`);
              } else {
                setGenerateError(status.error ?? "Generation completed but no image was returned.");
                setIsGenerating(false);
              }
            }
          } catch {
            // Network error during poll — don't stop, just retry on next tick
            console.warn("[poll] Network error, will retry...");
          }
        }, POLL_INTERVAL);
      };

      pollForResult();
    } catch {
      setGenerateError("Something went wrong. Please try again.");
      setIsGenerating(false);
      stopPolling();
    }
  };

  const handleCancel = () => {
    abortRef.current = true;
    stopPolling();
    setIsGenerating(false);
    setProgressMessage("");
    setElapsedSeconds(0);
  };

  const handleRetry = () => {
    setGenerateError(null);
    handleGenerate();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  return (
    <main className="flex-grow pt-24 pb-8 md:pt-32 md:pb-12 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-container to-surface min-h-[calc(100vh-4rem)]">
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ backgroundImage: "radial-gradient(#343dff 1px, transparent 1px)", backgroundSize: "20px 20px", opacity: 0.1 }}
      ></div>
      
      {/* Main Workspace Window */}
      <div className="w-[calc(100%-2rem)] md:w-full max-w-4xl mx-auto md:mx-4 bg-surface-dim border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative z-10">
        {/* Title Bar */}
        <div className="bg-primary px-3 md:px-4 py-2 border-b-4 border-black flex justify-between items-center">
          <span className="font-headline font-black text-white text-sm md:text-xl tracking-wide truncate pr-2">{currentFilter.name}</span>
          <div className="flex space-x-1 md:space-x-2">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-surface-container border-2 border-black flex items-center justify-center text-xs font-bold shrink-0">_</div>
            <div className="w-5 h-5 md:w-6 md:h-6 bg-surface-container border-2 border-black flex items-center justify-center text-xs font-bold shrink-0">□</div>
            <div className="w-5 h-5 md:w-6 md:h-6 bg-secondary border-2 border-black flex items-center justify-center text-white text-xs font-bold shrink-0 cursor-pointer">X</div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            {/* Left: Reference Style */}
            <div className="flex-1 w-full">
              <h3 className="font-headline font-black uppercase text-lg mb-4 text-primary italic">Reference Style</h3>
              <div className="bg-black p-2 border-4 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] aspect-square overflow-hidden relative group">
                <img 
                  className="w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-300" 
                  alt={currentFilter.name}
                  src={currentFilter.image}
                />
                <div className="absolute bottom-2 right-2 bg-[#FFFF00] text-black text-[10px] px-2 font-black border border-black">EXAMPLE_01.JPG</div>
              </div>
            </div>

            {/* Center: Arrow + Progress */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-4xl md:text-6xl text-primary font-black scale-y-150 rotate-90 md:rotate-0 my-4 md:my-0">double_arrow</span>
              {isGenerating && (
                <div className="flex flex-col items-center mt-2 space-y-1">
                  <span className="font-headline font-black text-xs text-secondary animate-pulse uppercase">
                    {progressMessage}
                  </span>
                  <span className="font-label text-[10px] font-bold text-on-surface opacity-70">
                    Elapsed: {formatTime(elapsedSeconds)}
                  </span>
                </div>
              )}
            </div>

            {/* Right: Upload Box */}
            <div className="flex-1 w-full h-full">
              <h3 className="font-headline font-black uppercase text-lg mb-4 text-primary italic">Your Image</h3>
              <ImageUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                error={uploadError}
                onError={setUploadError}
              />
            </div>
          </div>

          {/* Action Section */}
          <div className="flex flex-col items-center space-y-4 md:space-y-6 mt-8 md:mt-0">
            <div className="bg-secondary-container p-3 border-2 border-black flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-center md:text-left">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
              <p className="font-label text-xs font-bold text-on-secondary-container uppercase">Notice: Large images auto-compressed for maximum bandwidth efficiency. Netscape compatible.</p>
            </div>
            
            {generateError && (
              <div className={`font-bold px-4 py-3 border-2 border-black uppercase text-sm flex flex-col items-center gap-3 w-full justify-center ${
                noCredits ? "bg-[#FFFF00] text-black" : "bg-error text-white"
              }`}>
                <span>{noCredits ? "⚠ " : "Error: "}{generateError}</span>
                {noCredits ? (
                  <Link
                    href="/credits"
                    className="bg-primary text-white font-black text-sm px-6 py-2 border-2 border-black hover:scale-105 transition-transform uppercase"
                  >
                    BUY CREDITS NOW →
                  </Link>
                ) : (
                  <button
                    onClick={handleRetry}
                    className="bg-white text-error font-black text-xs px-4 py-1 border-2 border-black hover:bg-[#FFFF00] hover:text-black transition-colors uppercase shrink-0"
                  >
                    RETRY
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button 
                onClick={handleGenerate}
                disabled={!selectedFile || isGenerating}
                className="flex-1 md:flex-none bg-primary text-white font-headline font-black text-xl md:text-3xl px-6 py-4 md:px-12 md:py-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFFF00] hover:text-black hover:-translate-x-1 hover:-translate-y-1 md:hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none uppercase italic tracking-tighter disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
              >
                {isGenerating ? "GENERATING..." : `RUN ${currentFilter.name.toUpperCase()}`}
              </button>

              {isGenerating && (
                <button
                  onClick={handleCancel}
                  className="bg-secondary text-white font-headline font-black text-lg px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-error transition-colors uppercase italic tracking-tighter"
                >
                  CANCEL
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 sm:space-x-0">
              <div className="flex items-center space-x-1">
                <div className={`w-3 h-3 bg-tertiary border border-black ${isGenerating ? "animate-pulse" : ""}`}></div>
                <span className="text-[10px] font-bold font-label uppercase">Server: Online</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-3 h-3 bg-secondary border border-black ${isGenerating ? "animate-pulse" : ""}`}></div>
                <span className="text-[10px] font-bold font-label uppercase">
                   GPU Load: {isGenerating ? "99%" : "12%"}
                </span>
              </div>
              {isGenerating && (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-primary border border-black animate-ping"></div>
                  <span className="text-[10px] font-bold font-label uppercase text-primary">
                    TASK RUNNING
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-surface-container-highest border-t-2 border-black p-1 flex justify-between text-[8px] md:text-[10px] font-bold font-label px-2 md:px-4 uppercase">
          <span>Object(s) Selected: {selectedFile ? "1" : "0"}</span>
          <span>
            {isGenerating
              ? `Processing... ${formatTime(elapsedSeconds)}`
              : "Ready"}
          </span>
          {creditsRemaining !== null && (
            <span className={creditsRemaining <= 3 ? "text-secondary" : ""}>
              Credits: {creditsRemaining}
            </span>
          )}
          <span>Memelord AI v4.2.0</span>
        </div>
      </div>

      {/* Floating UI Accents */}
      <div className="absolute top-40 left-10 w-32 h-32 border-4 border-secondary opacity-20 pointer-events-none hidden lg:block"></div>
      <div className="absolute bottom-20 right-10 w-48 h-12 bg-tertiary opacity-10 -rotate-12 pointer-events-none hidden lg:block"></div>
    </main>
  );
}
