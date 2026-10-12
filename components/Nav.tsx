"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import { SITE_NAME } from "@/lib/config";

export default function Nav() {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const { toast } = useToast();

  const linkBase =
    "text-sm tracking-wide transition-colors hover:text-[color:var(--color-primary)]";
  const isActive = (href: string) =>
    pathname === href
      ? "text-[color:var(--color-primary)]"
      : "text-[color:var(--color-ink-soft)]";

  async function handleSignOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast(`Couldn't sign out: ${error.message}`, "error");
      return;
    }
    toast("Signed out.", "success");
    window.location.href = "/";
  }

  return (
    <header className="border-b border-[color:var(--color-border)] bg-[color:var(--color-bg)]/80 backdrop-saturate-150">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
       

        <Link
          href="/"
          className="flex items-center gap-3 font-display text-xl font-semibold tracking-tight text-[color:var(--color-ink)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://kanopoly.edu.ng/wp-content/uploads/2024/09/Kano-State-Polytechnic-logo.png"
            alt="Kano Polytechnic School of Technology"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span> {SITE_NAME}</span>
        </Link>

        <div className="flex items-center gap-7">
          <Link href="/gallery" className={`${linkBase} ${isActive("/gallery")}`}>
            The class
          </Link>

          {!loading && user && (
            <Link href="/add" className={`${linkBase} ${isActive("/add")}`}>
              Edit my page
            </Link>
          )}

          {!loading && !user && (
            <>
              <Link href="/login" className={`${linkBase} ${isActive("/login")}`}>
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-photo bg-[color:var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[color:var(--color-primary-dark)]"
              >
                Add your memory
              </Link>
            </>
          )}

          {!loading && user && (
            <button
              onClick={handleSignOut}
              className="text-sm tracking-wide text-[color:var(--color-ink-soft)] transition-colors hover:text-[color:var(--color-primary)]"
            >
              Sign out
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}