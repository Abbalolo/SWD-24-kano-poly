import Image from "next/image";
import Link from "next/link";
import { IMAGE_SIZES } from "@/lib/imageSizes";

type PreviewRow = {
  id: string;
  name: string;
  email: string;
  photo_url: string | null;
  created_at: string;
};

export default function PreviewCard({ row }: { row: PreviewRow }) {
  return (
    <article className="group relative">
      <Link
        href="/login"
        className="block overflow-hidden rounded-photo bg-[color:var(--color-paper)] shadow-soft transition-transform duration-300 hover:-rotate-1 hover:shadow-lift"
      >
        <div className="relative aspect-[4/5] w-full bg-[color:var(--color-border)]">
          {row.photo_url ? (
            <Image
              src={row.photo_url}
              alt={row.name}
              fill
              sizes={IMAGE_SIZES.previewCard}
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-hand text-2xl text-[color:var(--color-ink-mute)]">
                no photo yet
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-[color:var(--color-border)] p-5">
          <h3 className="font-display text-xl font-medium leading-tight text-[color:var(--color-ink)]">
            {row.name}
          </h3>
          <p className="mt-1.5 text-xs uppercase tracking-[0.14em] text-[color:var(--color-ink-mute)]">
            {row.email}
          </p>
          <p className="mt-4 text-sm text-[color:var(--color-primary)] underline-offset-4 group-hover:underline">
            Read more →
          </p>
        </div>
      </Link>
    </article>
  );
}