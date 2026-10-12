import Link from "next/link";

export default function PrevNextNav({
  prevId,
  nextId,
}: {
  prevId: string | null;
  nextId: string | null;
}) {
  return (
    <nav className="mt-16 flex items-center justify-between border-t border-[color:var(--color-border)] pt-8">
      {prevId ? (
        <Link
          href={`/classmate/${prevId}`}
          className="font-hand text-2xl text-[color:var(--color-ink-soft)] transition-colors hover:text-[color:var(--color-primary)]"
        >
          ← previous
        </Link>
      ) : (
        <span />
      )}

      {nextId ? (
        <Link
          href={`/classmate/${nextId}`}
          className="font-hand text-2xl text-[color:var(--color-ink-soft)] transition-colors hover:text-[color:var(--color-primary)]"
        >
          next →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
