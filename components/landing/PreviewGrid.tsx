import { createClient } from "@/lib/supabase";
import { PREVIEW_COUNT } from "@/lib/config";
import PreviewCard from "./PreviewCard";
import Link from "next/link";

type PreviewRow = {
  id: string;
  name: string;
  email: string;
  photo_url: string | null;
  created_at: string;
};

async function getPreview(): Promise<PreviewRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("classmates_public_preview")
    .select("id, name, email, photo_url, created_at")
    .order("created_at", { ascending: true })
    .limit(PREVIEW_COUNT);
  return (data as PreviewRow[]) ?? [];
}

async function getTotal(): Promise<number> {
  const supabase = createClient();
  const { count } = await supabase
    .from("classmates_public_preview")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function PreviewGrid() {
  const [rows, total] = await Promise.all([getPreview(), getTotal()]);
  const more = Math.max(0, total - rows.length);

  if (rows.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-photo border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-paper)] p-12 text-center">
          <p className="font-display text-2xl font-medium text-[color:var(--color-ink)]">
            No one's added themselves yet.
          </p>
          <p className="mt-3 text-[15px] text-[color:var(--color-ink-soft)]">
            Be the first. It takes about a minute.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-photo bg-[color:var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--color-primary-dark)]"
          >
            Add your memory
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 flex items-baseline justify-between gap-6">
        <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-tight tracking-tight">
          <span className="italic font-normal">A few</span> of us
        </h2>
        <p className="hidden font-hand text-2xl text-[color:var(--color-ink-soft)] sm:block">
          — just a peek
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row, i) => (
          <div
            key={row.id}
            className={i % 3 === 1 ? "lg:mt-10" : i % 3 === 2 ? "lg:mt-5" : ""}
          >
            <PreviewCard row={row} />
          </div>
        ))}
      </div>

      {more > 0 && (
        <div className="mt-16 flex flex-col items-center gap-4 border-t border-[color:var(--color-border)] pt-10 sm:flex-row sm:justify-between">
          <p className="text-[15px] text-[color:var(--color-ink-soft)]">
            There {more === 1 ? "is" : "are"}{" "}
            <span className="font-display text-lg font-medium text-[color:var(--color-ink)]">
              {more}
            </span>{" "}
            more {more === 1 ? "classmate" : "classmates"}. Log in to see
            everyone.
          </p>
          <Link
            href="/gallery"
            className="rounded-photo border border-[color:var(--color-primary)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-primary-light)]"
          >
            See the full class
          </Link>
        </div>
      )}
    </section>
  );
}
