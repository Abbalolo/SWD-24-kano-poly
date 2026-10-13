"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/config";
import { useToast } from "@/components/ui/Toast";
import {
  isValidRegNumber,
  normalizeRegNumber,
  formatRegNumberExample,
} from "@/lib/regNumber";

export default function SignupForm() {
  const [regNumber, setRegNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
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

    // 1) Reserve the reg number. No user_id, no name — just a placeholder
    //    row so the number can't be taken by someone else mid-signup.
    const { data: reserved, error: reserveErr } = await supabase.rpc(
      "reserve_reg_number",
      { p_reg_number: reg }
    );

    if (reserveErr) {
      setLoading(false);
      setError(reserveErr.message);
      toast(`Couldn't reserve that number: ${reserveErr.message}`, "error");
      return;
    }

    if (reserved === false) {
      setLoading(false);
      const msg = "Someone already registered with that number.";
      setError(msg);
      toast(msg, "error");
      return;
    }

    // 2) Create the auth user.
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth/callback`,
        data: { reg_number: reg },
      },
    });

    if (signUpErr || !signUpData.user) {
      // Roll back the reservation so the number isn't held hostage.
      await supabase.rpc("release_reg_number", { p_reg_number: reg });
      setLoading(false);
      const msg = signUpErr?.message ?? "Signup failed.";
      setError(msg);
      toast(`Signup failed: ${msg}`, "error");
      return;
    }

    // 3) Bind the reserved row to the new auth user.
    const { error: bindErr } = await supabase.rpc("bind_reg_number_to_user", {
      p_reg_number: reg,
      p_user_id: signUpData.user.id,
      p_email: email,
    });

    setLoading(false);

    if (bindErr) {
      setError(bindErr.message);
      toast(`Couldn't finish setup: ${bindErr.message}`, "error");
      return;
    }

    toast("Account created. Check your email to confirm.", "success");
    setDone(true);
  }

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <p className="font-display text-2xl font-medium text-[color:var(--color-ink)]">
          Check your inbox.
        </p>
        <p className="text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
          We sent a confirmation link to{" "}
          <span className="font-medium text-[color:var(--color-ink)]">
            {email}
          </span>
          . Click it, then log in with your registration number.
        </p>
        <p className="text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
          After you log in, you'll add your name, photo, and a line about
          yourself.
        </p>
      </div>
    );
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
          autoComplete="off"
          spellCheck={false}
          placeholder={formatRegNumberExample()}
          value={regNumber}
          onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
          className="mt-2 w-full rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 font-mono text-[15px] uppercase tracking-wide text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-primary)]"
        />
        <p className="mt-2 text-xs text-[color:var(--color-ink-mute)]">
          Like {formatRegNumberExample()}.
        </p>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-[15px] text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-primary)]"
        />
        <p className="mt-2 text-xs text-[color:var(--color-ink-mute)]">
          Used for password recovery.
        </p>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-[15px] text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-primary)]"
        />
        <p className="mt-2 text-xs text-[color:var(--color-ink-mute)]">
          At least 6 characters.
        </p>
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
        {loading ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-[color:var(--color-ink-soft)]">
        Already have one?{" "}
        <Link
          href="/login"
          className="text-[color:var(--color-primary)] underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}