import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "Log in — SWD 24 Class Memories" };

export default function LoginPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-20">
      <div className="rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-paper)] p-8 shadow-soft sm:p-10">
        <p className="font-hand text-2xl text-[color:var(--color-primary)]">
          welcome back —
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium leading-tight tracking-tight text-[color:var(--color-ink)]">
          Good to see you.
        </h1>
        <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
          Log in to see everyone in the class.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
