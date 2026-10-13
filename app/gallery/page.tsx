"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useUser } from "@/lib/auth";
import LoginForm from "@/components/auth/LoginForm";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import SearchSort from "@/components/gallery/SearchSort";

export type Classmate = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  message: string | null;
  photo_url: string | null;
  photo_url_2: string | null;
  photo_url_3: string | null;
  reg_number: string | null;
  created_at: string;
  updated_at: string;
};

export default function GalleryPage() {
  const { user, loading: authLoading } = useUser();
  const [rows, setRows] = useState<Classmate[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "name">("oldest");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("classmates")
        .select("*")
        .neq("name", "")
        .order("created_at", { ascending: true });
      if (!cancelled) {
        setRows((data as Classmate[]) ?? []);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading) {
    return (
      <section className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="text-sm text-[color:var(--color-ink-soft)]">Loading…</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-20">
        <div className="rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-paper)] p-8 shadow-soft sm:p-10">
          <p className="font-hand text-2xl text-[color:var(--color-primary)]">
            one second —
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium leading-tight tracking-tight text-[color:var(--color-ink)]">
            Log in to see everyone.
          </h1>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
            The full gallery is for classmates only. It keeps things between us.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </section>
    );
  }

  const filtered = rows
    .filter((r) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase().trim();
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.reg_number ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "newest")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-hand text-2xl text-[color:var(--color-primary)]">
            everybody, here —
          </p>
          <h1 className="mt-1 font-display text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-tight">
            The class
          </h1>
          <p className="mt-2 text-[15px] text-[color:var(--color-ink-soft)]">
            {rows.length} {rows.length === 1 ? "person" : "people"} so far.
          </p>
        </div>
        <SearchSort
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      {loading ? (
        <p className="text-sm text-[color:var(--color-ink-soft)]">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-photo border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-paper)] p-12 text-center">
          <p className="font-display text-2xl font-medium">No one found.</p>
          <p className="mt-3 text-[15px] text-[color:var(--color-ink-soft)]">
            Try a different name, email, or reg number — or clear the search.
          </p>
        </div>
      ) : (
        <GalleryGrid rows={filtered} />
      )}
    </section>
  );
}