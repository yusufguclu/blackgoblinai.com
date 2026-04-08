"use client";

import Link from "next/link";

interface ResultDisplayProps {
  imageSrc: string;
}

export default function ResultDisplay({ imageSrc }: ResultDisplayProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `memelord-creation-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(imageSrc, "_blank");
    }
  };

  return (
    <div className="space-y-8">
      {/* Result image */}
      <div className="border-4 border-black brutal-shadow overflow-hidden bg-black">
        <img
          src={imageSrc}
          alt="Generated AI image"
          className="mx-auto max-h-[70vh] w-full object-contain"
        />
      </div>

      {/* Success badge */}
      <div className="flex justify-center">
        <div className="bg-tertiary text-white font-headline font-black uppercase text-sm px-6 py-2 border-2 border-black brutal-shadow-sm inline-flex items-center gap-2">
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          YOUR MEME IS READY!
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={handleDownload}
          className="bg-primary text-white font-headline font-black text-xl px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFFF00] hover:text-black hover:-translate-x-1 hover:-translate-y-1 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none uppercase italic tracking-tighter flex items-center justify-center gap-3 cursor-pointer"
        >
          <span className="material-symbols-outlined">download</span>
          DOWNLOAD
        </button>

        <Link
          href="/"
          className="bg-white text-black font-headline font-black text-xl px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-surface-container-high hover:-translate-x-1 hover:-translate-y-1 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none uppercase italic tracking-tighter flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined">refresh</span>
          TRY AGAIN
        </Link>
      </div>
    </div>
  );
}
