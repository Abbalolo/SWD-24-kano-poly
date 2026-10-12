export default function ContactCard({
  email,
  phone,
  message,
}: {
  email: string;
  phone: string | null;
  message: string | null;
}) {
  return (
    <section className="rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-paper)] p-8 shadow-soft sm:p-10">
      <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-ink-mute)]">
        Get in touch
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--color-ink-mute)]">
            Email
          </p>
          <a
            href={`mailto:${email}`}
            className="mt-1 block font-display text-lg text-[color:var(--color-ink)] underline-offset-4 hover:text-[color:var(--color-primary)] hover:underline"
          >
            {email}
          </a>
        </div>

        {phone && (
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--color-ink-mute)]">
              Phone
            </p>
            <a
              href={`tel:${phone}`}
              className="mt-1 block font-display text-lg text-[color:var(--color-ink)] underline-offset-4 hover:text-[color:var(--color-primary)] hover:underline"
            >
              {phone}
            </a>
          </div>
        )}
      </div>

      {message && (
        <div className="mt-8 border-t border-[color:var(--color-border)] pt-6">
          <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--color-ink-mute)]">
            A message
          </p>
          <p className="mt-3 font-display text-lg italic leading-[1.65] text-[color:var(--color-ink)]">
            "{message}"
          </p>
        </div>
      )}
    </section>
  );
}
