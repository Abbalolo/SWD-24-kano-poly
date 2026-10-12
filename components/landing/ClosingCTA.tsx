import Link from "next/link";

export default function ClosingCTA() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <div className="relative rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-paper)] p-10 shadow-soft sm:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-4 -left-3 rotate-[-8deg] font-hand text-3xl text-[color:var(--color-accent-warm)]"
        >
          psst —
        </div>

        <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-tight tracking-tight text-[color:var(--color-ink)]">
          If you were in our class,
          <span className="italic font-normal"> add yourself.</span>
        </p>

        <p className="mt-5 max-w-xl text-[16px] leading-[1.7] text-[color:var(--color-ink-soft)]">
          It doesn't have to be perfect. A photo, a sentence, and where you are
          now is enough. The rest of us will fill in the gaps.
        </p>

        <div className="mt-8">
          <Link
            href="/signup"
            className="inline-block rounded-photo bg-[color:var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--color-primary-dark)]"
          >
            Add your memory
          </Link>
        </div>
      </div>
    </section>
  );
}
