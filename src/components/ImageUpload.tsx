"use client";

import { useCallback, useRef, useState } from "react";
import { validateImageFile } from "@/lib/validators";

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  previewUrl: string | null;
  error: string | null;
  onError: (error: string | null) => void;
}

export default function ImageUpload({
  onFileSelect,
  selectedFile,
  previewUrl,
  error,
  onError,
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        onError(validation.error ?? "Invalid file.");
        return;
      }
      onError(null);
      onFileSelect(file);
    },
    [onFileSelect, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClick = () => fileInputRef.current?.click();

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`bg-surface-container-highest border-4 border-dashed border-primary w-full aspect-square flex flex-col items-center justify-center p-6 text-center transition-colors cursor-pointer group relative overflow-hidden ${isDragOver ? "bg-white" : "hover:bg-white"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleInputChange}
          className="hidden"
        />

        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
                onError(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="absolute bottom-2 right-2 bg-secondary text-white text-[10px] px-3 font-black py-1 uppercase border-2 border-black hover:bg-[#FFFF00] hover:text-black transition-colors"
            >
              CLEAR
            </button>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-7xl text-primary mb-4 group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
            <span className="font-label font-bold text-sm text-on-surface uppercase tracking-tighter">Click or Drag to Upload</span>
            <span className="font-label text-[10px] mt-4 opacity-70 bg-secondary text-white px-2">MAX FILE SIZE: 2MB</span>
          </>
        )}
      </div>
      {error && (
        <div className="mt-4 bg-error text-white font-bold px-4 py-2 border-2 border-black uppercase text-sm w-full text-center">
          {error}
        </div>
      )}
    </div>
  );
}
