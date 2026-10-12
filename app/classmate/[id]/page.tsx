import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PhotoGallery from "@/components/profile/PhotoGallery";
import ContactCard from "@/components/profile/ContactCard";
import PrevNextNav from "@/components/profile/PrevNextNav";
import ShareButton from "@/components/profile/ShareButton";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

async function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // read-only in server components
      },
    },
  });
}

export default async function ClassmatePage({ params }: Params) {
  const { id } = await params;
  const supabase = await getSupabase();

  const { data: person } = await supabase
    .from("classmates")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!person) notFound();

  const { data: list } = await supabase
    .from("classmates")
    .select("id")
    .order("created_at", { ascending: true });

  const ids = (list ?? []).map((r) => r.id);
  const idx = ids.indexOf(person.id);
  const prevId = idx > 0 ? ids[idx - 1] : null;
  const nextId = idx >= 0 && idx < ids.length - 1 ? ids[idx + 1] : null;

  const v = person.updated_at;
  const photos = [
    {
      url: person.photo_url ? `${person.photo_url}?v=${v}` : null,
      label: `${person.name} — primary photo`,
    },
    {
      url: person.photo_url_2 ? `${person.photo_url_2}?v=${v}` : null,
      label: `${person.name} — memory 1`,
    },
    {
      url: person.photo_url_3 ? `${person.photo_url_3}?v=${v}` : null,
      label: `${person.name} — memory 2`,
    },
  ];

  const photoCount = photos.filter((p) => p.url).length;
  const memberSince = new Date(person.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8">
        <Link
          href="/gallery"
          className="text-sm text-[color:var(--color-ink-soft)] transition-colors hover:text-[color:var(--color-primary)]"
        >
          ← Back to gallery
        </Link>
      </div>

      <ProfileHeader
        name={person.name}
        bio={person.bio}
        photoCount={photoCount}
        memberSince={memberSince}
      />

      <PhotoGallery photos={photos} />

      <div className="mt-16 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <ContactCard
          email={person.email}
          phone={person.phone}
          message={person.message}
        />

        <aside className="space-y-4">
          <ShareButton name={person.name} />
          <Link
            href="/add"
            className="block rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-paper)] px-5 py-3 text-center text-sm font-medium text-[color:var(--color-ink)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
          >
            Edit my profile
          </Link>
        </aside>
      </div>

      <PrevNextNav prevId={prevId} nextId={nextId} />
    </section>
  );
}
