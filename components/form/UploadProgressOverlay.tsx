"use client";

const MESSAGES = [
  "Uploading your photos…",
  "Saving your details…",
  "Almost there…",
];

export default function UploadProgressOverlay({ step }: { step: number }) {
  const message = MESSAGES[Math.min(step, MESSAGES.length - 1)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--color-bg)]/90">
      <div className="mx-6 w-full max-w-sm rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-paper)] p-8 text-center shadow-lift">
        <div className="mx-auto mb-6 h-10 w-10 animate-spin-slow rounded-full border-2 border-[color:var(--color-border)] border-t-[color:var(--color-primary)]" />
        <p className="font-display text-xl font-medium text-[color:var(--color-ink)]">
          {message}
        </p>
        <p className="mt-2 text-sm text-[color:var(--color-ink-soft)]">
          Don't close this tab.
        </p>
      </div>
    </div>
  );
}
