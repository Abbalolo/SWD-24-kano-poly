export const SITE_NAME = "SWD 24 Class Memories";
export const SITE_TAGLINE = "A place to remember each other.";
export const PREVIEW_COUNT = 4;

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")
  );
}

export const STORAGE_BUCKET = "classmate-photos";

export function photoPath(
  userId: string,
  slot: "primary" | "memory-1" | "memory-2"
): string {
  return `${userId}/${slot}.jpg`;
}
