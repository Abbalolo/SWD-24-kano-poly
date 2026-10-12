import { createClient } from "./supabase";

export type CollagePhoto = {
  id: string;
  name: string;
  url: string;
  caption: string;
};

const CAPTIONS = [
  "the first day back",
  "we were so young",
  "still laughing about this",
];

/**
 * Fetches up to `count` recent classmate photos for the hero collage.
 * Uses the public preview view, so it works while logged out.
 * Returns an empty array if there are no photos yet.
 */
export async function getCollagePhotos(count = 3): Promise<CollagePhoto[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("classmates_public_preview")
    .select("id, name, photo_url, created_at")
    .not("photo_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(count);

  if (error || !data) return [];

  return data.map((row, i) => ({
    id: row.id,
    name: row.name,
    url: row.photo_url as string,
    caption: CAPTIONS[i % CAPTIONS.length],
  }));
}
