export default function ProfileHeader({
  name,
  bio,
  photoCount,
  memberSince,
}: {
  name: string;
  bio: string | null;
  photoCount: number;
  memberSince: string;
}) {
  return (
    <header className="mb-12">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.02] tracking-tight text-[color:var(--color-ink)]">
          {name}
        </h1>
        <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-mute)]">
          {photoCount} {photoCount === 1 ? "photo" : "photos"}
        </span>
      </div>

      {bio && (
        <p className="mt-5 max-w-2xl text-[17px] leading-[1.7] text-[color:var(--color-ink-soft)]">
          {bio}
        </p>
      )}

      <p className="mt-6 text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
        In the archive since {memberSince}
      </p>
    </header>
  );
}
