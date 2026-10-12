import { createClient } from "@/lib/supabase";

async function getStats() {
  const supabase = createClient();
  const { count } = await supabase
    .from("classmates_public_preview")
    .select("*", { count: "exact", head: true });

  return { count: count ?? 0 };
}

export default async function Stats() {
  const { count } = await getStats();
  const years = 6;

  return (
    <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-paper)]">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-10 px-6 py-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--color-ink-mute)]">
            In the archive
          </p>
          <p className="mt-3 font-display text-[clamp(3rem,8vw,6rem)] font-medium leading-none tracking-tight text-[color:var(--color-ink)]">
            {count}
          </p>
          <p className="mt-3 text-sm text-[color:var(--color-ink-soft)]">
            classmates remembered
          </p>
        </div>

        <div className="flex items-end gap-10">
          <div>
            <p className="font-display text-4xl font-medium leading-none tracking-tight">
              {years}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[color:var(--color-ink-mute)]">
              Years together
            </p>
          </div>
          <div>
            <p className="font-display text-2xl font-medium leading-none tracking-tight">
              3
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[color:var(--color-ink-mute)]">
              Photos each
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
