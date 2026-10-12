"use client";

import { useState } from "react";

export default function ShareButton({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // user cancelled — no-op
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="w-full rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-paper)] px-5 py-3 text-sm font-medium text-[color:var(--color-ink)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
    >
      {copied ? "Link copied" : "Share this profile"}
    </button>
  );
}
