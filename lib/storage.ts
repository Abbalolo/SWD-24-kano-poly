"use client";

import { createClient } from "./supabase";
import { STORAGE_BUCKET, photoPath } from "./config";

export type PhotoSlot = "primary" | "memory-1" | "memory-2";

export async function uploadPhoto(
  userId: string,
  slot: PhotoSlot,
  file: File
): Promise<string> {
  const supabase = createClient();
  const path = photoPath(userId, slot);

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type || "image/jpeg",
      // One year. Supabase's storage API also sends `Cache-Control: public,
      // max-age=31536000` in the response, so browsers + CDNs reuse it.
      cacheControl: "31536000",
    });

  if (error) throw error;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deletePhoto(
  userId: string,
  slot: PhotoSlot
): Promise<void> {
  const supabase = createClient();
  const path = photoPath(userId, slot);

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) throw error;
}

export function publicPhotoUrl(
  userId: string,
  slot: PhotoSlot,
  cacheBust?: string | number
): string {
  const supabase = createClient();
  const path = photoPath(userId, slot);
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  const url = data.publicUrl;
  return cacheBust ? `${url}?v=${cacheBust}` : url;
}