"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";
import {
  isValidRegNumber,
  normalizeRegNumber,
  formatRegNumberExample,
} from "@/lib/regNumber";

export default function LoginForm() {
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const reg = normalizeRegNumber(regNumber);
    if (!isValidRegNumber(reg)) {
      const msg = `That doesn't look like a registration number. Try ${formatRegNumberExample()}.`;
      setError(msg);
      toast(msg, "error");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // 1) Resolve reg number → email.
    const { data: email, error: lookupErr } = await supabase.rpc(
      "lookup_email_by_reg_number",
      { reg }
    );

    if (lookupErr) {
      setLoading(false);
      setError(lookupErr.message);
      toast(`Couldn't look up that number: ${lookupErr.message}`, "error");
      return;
    }

    if (!email) {
      setLoading(false);
      const msg = "No account found with that registration number.";
      setError(msg);
      toast(msg, "error");
      return;
    }

    // 2) Sign in with the resolved email.
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: email as string,
      password,
    });

    setLoading(false);

    if (signInErr) {
      setError(signInErr.message);
      toast(`Login failed: ${signInErr.message}`, "error");
      return;
    }

    toast("Welcome back.", "success");
    router.push("/gallery");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="regNumber"
          className="block text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]"
        >
          Registration number
        </label>
        <input
          id="regNumber"
          type="text"
          required
          autoCapitalize="characters"
          autoComplete="username"
          spellCheck={false}
          placeholder={formatRegNumberExample()}
          value={regNumber}
          onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
          className="mt-2 w-full rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 font-mono text-[15px] uppercase tracking-wide text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-primary)]"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label
            htmlFor="password"
            className="block text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]"
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-primary)]"
          >
            Forgot?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-[15px] text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-primary)]"
        />
      </div>

      {error && (
        <p className="rounded-photo border border-[color:var(--color-accent-warm)]/30 bg-[color:var(--color-accent-warm)]/10 px-4 py-3 text-sm text-[color:var(--color-accent-warm)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-photo bg-[color:var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--color-primary-dark)] disabled:opacity-50"
      >
        {loading ? "Logging in…" : "Log in"}
      </button>

      <p className="text-center text-sm text-[color:var(--color-ink-soft)]">
        First time here?{" "}
        <Link
          href="/signup"
          className="text-[color:var(--color-primary)] underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}