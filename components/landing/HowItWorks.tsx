const steps = [
  {
    n: "1",
    title: "Make an account",
    body: "Just an email and a password. Takes under a minute.",
  },
  {
    n: "2",
    title: "Add three photos",
    body: "One for your card, two more for your page. Or just one — no pressure.",
  },
  {
    n: "3",
    title: "Write a line",
    body: "Where you are now, what you remember. A sentence is enough.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-14 flex items-baseline gap-4">
        <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-tight tracking-tight">
          How it works
        </h2>
        <span className="font-hand text-2xl text-[color:var(--color-primary)]">
          — three small things
        </span>
      </div>

      <ol className="grid gap-12 sm:grid-cols-3 sm:gap-6">
        {steps.map((step, i) => (
          <li key={step.n} className="relative">
            <div className="flex items-start gap-4">
              <span className="hand-circle flex h-12 w-12 shrink-0 items-center justify-center font-display text-2xl font-medium text-[color:var(--color-primary)]">
                {step.n}
              </span>
              <div className="pt-1">
                <h3 className="font-display text-xl font-medium text-[color:var(--color-ink)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                  {step.body}
                </p>
              </div>
            </div>

            {i < steps.length - 1 && (
              <svg
                aria-hidden
                className="pointer-events-none absolute -right-3 top-6 hidden sm:block"
                width="60"
                height="24"
                viewBox="0 0 60 24"
                fill="none"
              >
                <path
                  d="M2 14 C18 4 40 4 54 12"
                  stroke="var(--color-primary)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="1 4"
                />
                <path
                  d="M48 8 L56 12 L48 16"
                  stroke="var(--color-primary)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
