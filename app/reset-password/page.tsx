import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata = { title: "Reset password — SWD 24 Class Memories" };

export default function ResetPasswordPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-20">
      <div className="rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-paper)] p-8 shadow-soft sm:p-10">
        <p className="font-hand text-2xl text-[color:var(--color-primary)]">
          almost there —
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium leading-tight tracking-tight text-[color:var(--color-ink)]">
          Set a new password.
        </h1>

        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-[color:var(--color-ink-soft)]">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
