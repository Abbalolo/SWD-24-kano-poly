import Link from "next/link";
import Image from "next/image";
import { getCollagePhotos } from "@/lib/photos";

export default async function Hero() {
  const photos = await getCollagePhotos(3);
  const [p1, p2, p3] = photos;

  return (
    <section className="relative overflow-hidden">
      <div className="grain relative mx-auto max-w-6xl px-6 pt-20 pb-28 sm:pt-28 sm:pb-36">
        {/* Decorative postmark */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-6 top-16 hidden rotate-[8deg] opacity-70 sm:block"
        >
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="var(--color-ink-mute)"
              strokeWidth="1.5"
              strokeDasharray="2 3"
            />
            <text
              x="48"
              y="44"
              textAnchor="middle"
              fontFamily="var(--font-instrument)"
              fontSize="10"
              letterSpacing="1.5"
              fill="var(--color-ink-mute)"
            >
              POSTED
            </text>
            <text
              x="48"
              y="58"
              textAnchor="middle"
              fontFamily="var(--font-instrument)"
              fontSize="10"
              letterSpacing="1.5"
              fill="var(--color-ink-mute)"
            >
              FROM KANO
            </text>
          </svg>
        </div>

        {/* Paper clip */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-2 top-24 hidden -rotate-[14deg] opacity-60 lg:block"
        >
          <svg width="42" height="72" viewBox="0 0 42 72" fill="none">
            <path
              d="M12 60 L12 14 C12 6 26 6 26 14 L26 58 C26 66 14 66 14 58 L14 22"
              stroke="var(--color-ink-mute)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="max-w-3xl">
          <p className="mb-6 text-xs uppercase tracking-[0.24em] text-[color:var(--color-ink-mute)]">
            Kano Polytechnic School of Technology
            <span className="mx-2 text-[color:var(--color-primary)]">·</span>
            <span className="italic normal-case tracking-normal font-hand text-base text-[color:var(--color-ink-soft)]">
              an archive, kept by us
            </span>
          </p>

          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.98] tracking-tight text-[color:var(--color-ink)]">
            <span className="italic font-normal">Our</span> Class{" "}
            <span className="hand-underline">Memories</span>
          </h1>

          <p className="mt-8 max-w-xl text-[17px] leading-[1.7] text-[color:var(--color-ink-soft)]">
            A place to remember each other. Photos, contact info, the small
            things. Some of us are in Kano, some elsewhere in Nigeria. This is
            where we keep in touch.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="rounded-photo bg-[color:var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--color-primary-dark)]"
            >
              Add your memory
            </Link>
            <Link
              href="/gallery"
              className="rounded-photo border border-[color:var(--color-primary)] px-6 py-3 text-sm font-medium text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-primary-light)]"
            >
              See the class
            </Link>
          </div>
        </div>

        {/* Collage area */}
        <div className="relative mt-20 h-[320px] sm:h-[420px]">
          <CollageSlot
            photo={p1}
            caption="the first day back"
            className="absolute left-0 top-4 w-[46%] max-w-[280px] rotate-[-3deg] shadow-soft"
            captionPosition="below"
          />

          <CollageSlot
            photo={p2}
            caption=""
            className="absolute left-[38%] top-24 w-[42%] max-w-[260px] rotate-[2deg] shadow-lift"
            captionPosition="none"
          />

          <CollageSlot
            photo={p3}
            caption="we were so young"
            className="absolute right-0 top-0 w-[38%] max-w-[240px] rotate-[4deg] shadow-soft"
            captionPosition="below-right"
          />
        </div>
      </div>

      <div className="torn-edge" aria-hidden />
    </section>
  );
}

function CollageSlot({
  photo,
  caption,
  className,
  captionPosition,
}: {
  photo?: { id: string; name: string; url: string };
  caption: string;
  className: string;
  captionPosition: "below" | "below-right" | "none";
}) {
  return (
    <div className={className}>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-photo bg-[color:var(--color-border)]">
        {photo ? (
          <Image
            src={photo.url}
            alt={photo.name}
            fill
            sizes="(max-width: 640px) 46vw, 280px"
            className="object-cover"
          />
        ) : (
          <EmptyFrame />
        )}
      </div>

      {caption ? (
        <p
          className={`mt-3 font-hand text-xl text-[color:var(--color-ink-soft)] ${
            captionPosition === "below-right" ? "text-right" : ""
          }`}
        >
          {caption}
        </p>
      ) : null}
    </div>
  );
}

function EmptyFrame() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-primary-light)]">
      <svg
        width="60%"
        height="60%"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
        className="opacity-50"
      >
        <path
          d="M14 76 L34 46 L50 62 L66 36 L86 76 Z"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="none"
        />
        <circle
          cx="34"
          cy="28"
          r="7"
          stroke="var(--color-primary)"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
}