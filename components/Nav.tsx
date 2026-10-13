"use client";

import { useEffect, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [menuOpen]);

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
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        {/* Logo */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 font-display text-lg font-semibold tracking-tight text-[color:var(--color-ink)] sm:text-xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://kanopoly.edu.ng/wp-content/uploads/2024/09/Kano-State-Polytechnic-logo.png"
            alt="Kano Polytechnic School of Technology"
            width={36}
            height={36}
            className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
          />
          <span className="truncate">{SITE_NAME}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 md:flex">
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

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="flex h-10 w-10 items-center justify-center rounded-photo text-[color:var(--color-ink)] transition-colors hover:bg-[color:var(--color-primary-light)] md:hidden"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-[color:var(--color-border)] bg-[color:var(--color-bg)] md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
            <MobileLink
              href="/gallery"
              active={pathname === "/gallery"}
              onClick={() => setMenuOpen(false)}
            >
              The class
            </MobileLink>

            {!loading && user && (
              <MobileLink
                href="/add"
                active={pathname === "/add"}
                onClick={() => setMenuOpen(false)}
              >
                Edit my page
              </MobileLink>
            )}

            {!loading && !user && (
              <>
                <MobileLink
                  href="/login"
                  active={pathname === "/login"}
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </MobileLink>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="mt-3 rounded-photo bg-[color:var(--color-primary)] px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[color:var(--color-primary-dark)]"
                >
                  Add your memory
                </Link>
              </>
            )}

            {!loading && user && (
              <button
                onClick={handleSignOut}
                className="mt-2 rounded-photo px-3 py-3 text-left text-sm text-[color:var(--color-ink-soft)] transition-colors hover:bg-[color:var(--color-primary-light)] hover:text-[color:var(--color-primary)]"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function MobileLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-photo px-3 py-3 text-sm tracking-wide transition-colors hover:bg-[color:var(--color-primary-light)] ${
        active
          ? "text-[color:var(--color-primary)]"
          : "text-[color:var(--color-ink-soft)]"
      }`}
    >
      {children}
    </Link>
  );
}

function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}