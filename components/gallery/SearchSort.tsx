"use client";

import { useEffect, useState } from "react";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  sort: "newest" | "oldest" | "name";
  onSortChange: (v: "newest" | "oldest" | "name") => void;
};

export default function SearchSort({
  query,
  onQueryChange,
  sort,
  onSortChange,
}: Props) {
  // Local input state so typing doesn't filter until the user clicks Search
  // (or presses Enter).
  const [draft, setDraft] = useState(query);

  // Keep local input in sync if the parent resets the query externally.
  useEffect(() => {
    setDraft(query);
  }, [query]);

  function submit() {
    onQueryChange(draft.trim());
  }

  function clear() {
    setDraft("");
    onQueryChange("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      clear();
    }
  }

  const hasQuery = query.length > 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="w-full sm:w-auto">
        <label
          htmlFor="gallery-search"
          className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]"
        >
          Search the class
        </label>
        <div className="flex w-full items-stretch gap-2">
          <input
            id="gallery-search"
            type="text"
            inputMode="search"
            placeholder="Name, email, or reg number…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-paper)] px-4 py-2.5 text-sm text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-primary)] sm:w-64"
          />

          <button
            type="button"
            onClick={submit}
            className="rounded-photo bg-[color:var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--color-primary-dark)]"
          >
            Search
          </button>

          {hasQuery && (
            <button
              type="button"
              onClick={clear}
              className="rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-paper)] px-3 py-2.5 text-sm text-[color:var(--color-ink-soft)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="w-full sm:w-auto">
        <label
          htmlFor="gallery-sort"
          className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]"
        >
          Sort
        </label>
        <select
          id="gallery-sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as Props["sort"])}
          className="w-full rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-paper)] px-4 py-2.5 text-sm text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-primary)] sm:w-auto"
        >
          <option value="oldest">Oldest first</option>
          <option value="newest">Newest first</option>
          <option value="name">By name</option>
        </select>
      </div>
    </div>
  );
}