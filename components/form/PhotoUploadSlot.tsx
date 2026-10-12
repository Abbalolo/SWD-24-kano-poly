"use client";

import { useEffect, useRef, useState } from "react";

export type PhotoSlotProps = {
  label: string;
  required?: boolean;
  hint?: string;
  file: File | null;
  existingUrl?: string | null;
  onSelect: (file: File | null) => void;
};

export default function PhotoUploadSlot({
  label,
  required,
  hint,
  file,
  existingUrl,
  onSelect,
}: PhotoSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const preview = objectUrl ?? existingUrl ?? null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    onSelect(f);
  }

  function handleRemove() {
    if (existingUrl && !file) {
      const ok = window.confirm(
        `Remove this photo? It will be deleted when you save.`
      );
      if (!ok) return;
    }
    onSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleReplace() {
    inputRef.current?.click();
  }

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]">
          {label}
          {required && (
            <span className="ml-1 text-[color:var(--color-accent-warm)]">*</span>
          )}
        </span>
        {hint && (
          <span className="font-hand text-lg text-[color:var(--color-ink-mute)]">
            {hint}
          </span>
        )}
      </div>

      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-photo border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-bg)]">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="h-full w-full object-cover" />
        ) : (
          <button
            type="button"
            onClick={handleReplace}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-center"
          >
            <span className="font-display text-2xl text-[color:var(--color-ink-mute)]">
              +
            </span>
            <span className="text-sm text-[color:var(--color-ink-soft)]">
              Choose a photo
            </span>
          </button>
        )}

        {preview && (
          <div className="absolute right-2 top-2 flex gap-1.5">
            <button
              type="button"
              onClick={handleReplace}
              className="rounded-full bg-[color:var(--color-ink)]/70 px-2.5 py-1 text-xs text-white backdrop-blur-sm transition-colors hover:bg-[color:var(--color-ink)]"
              aria-label={`Replace ${label}`}
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-full bg-[color:var(--color-accent-warm)]/90 px-2.5 py-1 text-xs text-white backdrop-blur-sm transition-colors hover:bg-[color:var(--color-accent-warm)]"
              aria-label={`Remove ${label}`}
            >
              Remove
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  );
}