"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";
import { IMAGE_SIZES } from "@/lib/imageSizes";

export type GalleryPhoto = {
  url: string | null;
  label: string;
};

export default function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const available = photos
    .map((p, i) => ({ ...p, index: i }))
    .filter((p) => p.url);

  const primary = photos[0];
  const memory1 = photos[1];
  const memory2 = photos[2];

  const availableIndex = (slot: number) =>
    available.findIndex((p) => p.index === slot);

  return (
    <>
      {/* Desktop */}
      <div className="hidden gap-4 md:grid md:grid-cols-3">
        <div className="col-span-2">
          <PhotoTile
            photo={primary}
            aspect="aspect-[4/5]"
            onClick={() => primary.url && setLightbox(0)}
            sizes={IMAGE_SIZES.profilePrimary}
          />
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <PhotoTile
            photo={memory1}
            aspect="aspect-[4/5]"
            onClick={() => memory1.url && setLightbox(1)}
            sizes={IMAGE_SIZES.profileMemory}
          />
          <PhotoTile
            photo={memory2}
            aspect="aspect-[4/5]"
            onClick={() => memory2.url && setLightbox(2)}
            sizes={IMAGE_SIZES.profileMemory}
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="snap-row -mx-6 flex gap-4 overflow-x-auto px-6 md:hidden">
        {photos.map((p, i) => (
          <div key={i} className="w-[78%] shrink-0">
            <PhotoTile
              photo={p}
              aspect="aspect-[4/5]"
              onClick={() => p.url && setLightbox(i)}
              sizes={IMAGE_SIZES.profilePrimary} // Using primary size for mobile as well; adjust if needed
            />
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <Lightbox
          photos={photos}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onIndexChange={setLightbox}
        />
      )}
    </>
  );
}

function PhotoTile({
  photo,
  aspect,
  onClick,
  sizes,
}: {
  photo: GalleryPhoto;
  aspect: string;
  onClick: () => void;
  sizes: string;
}) {
  if (!photo.url) {
    return (
      <div
        className={`${aspect} flex items-center justify-center rounded-photo border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-bg)] p-6 text-center`}
      >
        <p className="font-hand text-xl text-[color:var(--color-ink-mute)]">
          More memories coming soon
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${aspect} group relative w-full overflow-hidden rounded-photo bg-[color:var(--color-border)]`}
    >
      <Image
        src={photo.url}
        alt={photo.label}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </button>
  );
}
