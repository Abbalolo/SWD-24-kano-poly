import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = { title: "Forgot password — SWD 24 Class Memories" };

export default function ForgotPasswordPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-20">
      <div className="rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-paper)] p-8 shadow-soft sm:p-10">
        <p className="font-hand text-2xl text-[color:var(--color-primary)]">
          it happens —
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium leading-tight tracking-tight text-[color:var(--color-ink)]">
          Forgot your password?
        </h1>
        <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
          Give us the email you used. We'll send a reset link.
        </p>

        <div className="mt-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </section>
  );
}
