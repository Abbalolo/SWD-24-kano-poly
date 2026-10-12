"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { GalleryPhoto } from "./PhotoGallery";
import { IMAGE_SIZES } from "@/lib/imageSizes";

export default function Lightbox({
  photos,
  index,
  onClose,
  onIndexChange,
}: {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const available = photos
    .map((p, i) => ({ ...p, index: i }))
    .filter((p) => p.url);

  const current = photos[index];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  });

  function next() {
    const pos = available.findIndex((p) => p.index === index);
    if (pos < available.length - 1) onIndexChange(available[pos + 1].index);
  }

  function prev() {
    const pos = available.findIndex((p) => p.index === index);
    if (pos > 0) onIndexChange(available[pos - 1].index);
  }

  if (!current.url) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--color-ink)]/95 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
        aria-label="Close"
      >
        Close
      </button>

      <div
        className="relative max-h-[88vh] w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/10]">
          <Image
            src={current.url}
            alt={current.label}
            fill
            sizes={IMAGE_SIZES.lightbox}
            className="rounded-photo object-contain"
          />
        </div>

        {available.length > 1 && (
          <>\n            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-white transition-colors hover:bg-white/20"
              aria-label="Previous photo"
            >
              ←
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-white transition-colors hover:bg-white/20"
              aria-label="Next photo"
            >
              →
            </button>
          </> )}
      </div>
    </div>
  );
}
