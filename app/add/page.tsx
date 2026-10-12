import ClassmateForm from "@/components/form/ClassmateForm";

export const metadata = { title: "Add your memory — SWD 24 Class Memories" };

export default function AddPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-hand text-2xl text-[color:var(--color-primary)]">
        your page —
      </p>
      <h1 className="mt-1 font-display text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-tight">
        Tell us about you.
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
        One photo is required. The other two are for your profile page. Nothing
        uploads until you click the button at the bottom.
      </p>

      <div className="mt-12">
        <ClassmateForm />
      </div>
    </section>
  );
}
