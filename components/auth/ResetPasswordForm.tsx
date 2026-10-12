"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/Toast";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match.");
      toast("Passwords don't match.", "error");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      toast("Password must be at least 6 characters.", "error");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      toast(`Couldn't update password: ${error.message}`, "error");
      return;
    }

    toast("Password updated.", "success");
    router.push("/gallery");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="password"
          className="block text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]"
        >
          New password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-[15px] text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-primary)]"
        />
      </div>

      <div>
        <label
          htmlFor="confirm"
          className="block text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]"
        >
          Confirm
        </label>
        <input
          id="confirm"
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
        {loading ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}