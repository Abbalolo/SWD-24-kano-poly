"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/config";
import { useToast } from "@/components/ui/Toast";
import { normalizeRegNumber } from "@/lib/regNumber";

export default function ForgotPasswordForm() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    let target = input.trim();

    // If it doesn't contain an "@", treat it as a registration number and
    // resolve it to the account email.
    if (!target.includes("@")) {
      const reg = normalizeRegNumber(target);
      const { data: email, error: lookupErr } = await supabase.rpc(
        "lookup_email_by_reg_number",
        { reg }
      );

      if (lookupErr || !email) {
        setLoading(false);
        const msg = "No account found with that registration number.";
        setError(msg);
        toast(msg, "error");
        return;
      }

      target = email as string;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(target, {
      redirectTo: `${getSiteUrl()}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      toast(`Couldn't send reset link: ${error.message}`, "error");
      return;
    }

    toast("Reset link sent. Check your inbox.", "success");
    setDone(true);
  }

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <p className="font-display text-2xl font-medium text-[color:var(--color-ink)]">
          Sent.
        </p>
        <p className="text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
          If that account is on file, a reset link is on its way.
        </p>
        <Link
          href="/login"
          className="inline-block text-sm text-[color:var(--color-primary)] underline-offset-4 hover:underline"
        >
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="identifier"
          className="block text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]"
        >
          Registration number or email
        </label>
        <input
          id="identifier"
          type="text"
          required
          autoCapitalize="characters"
          autoComplete="username"
          spellCheck={false}
          placeholder="HND/SWD/24/0008 or you@example.com"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
        {loading ? "Sending…" : "Send reset link"}
      </button>

      <p className="text-center text-sm text-[color:var(--color-ink-soft)]">
        <Link
          href="/login"
          className="text-[color:var(--color-primary)] underline-offset-4 hover:underline"
        >
          Back to log in
        </Link>
      </p>
    </form>
  );
}