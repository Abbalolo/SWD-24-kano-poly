import Image from "next/image";
import Link from "next/link";
import { IMAGE_SIZES } from "@/lib/imageSizes";

export type GalleryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  message: string | null;
  photo_url: string | null;
  updated_at: string;
};

export default function GalleryCard({ row }: { row: GalleryRow }) {
  return (
    <article className="pin group">
      <Link
        href={`/classmate/${row.id}`}
        className="block overflow-hidden rounded-photo bg-[color:var(--color-paper)] shadow-soft transition-all duration-300 hover:-rotate-1 hover:shadow-lift"
      >
        <div className="relative aspect-[4/5] w-full bg-[color:var(--color-border)]">
          {row.photo_url ? (
            <Image
              src={row.photo_url}
              alt={row.name}
              fill
              sizes={IMAGE_SIZES.card}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
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
          {row.phone && (
            <p className="mt-1 text-xs text-[color:var(--color-ink-soft)]">
              {row.phone}
            </p>
          )}
          {row.bio && (
            <p className="mt-4 line-clamp-2 text-sm leading-[1.65] text-[color:var(--color-ink-soft)]">
              {row.bio}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}