"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { uploadPhoto, deletePhoto } from "@/lib/storage";
import { useUser } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";
import PhotoUploadSlot from "./PhotoUploadSlot";
import UploadProgressOverlay from "./UploadProgressOverlay";
import { formatRegNumberExample } from "@/lib/regNumber";

type Existing = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  message: string | null;
  photo_url: string | null;
  photo_url_2: string | null;
  photo_url_3: string | null;
  reg_number: string | null;
  updated_at: string;
};

export default function ClassmateForm() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const [regNumber, setRegNumber] = useState("");

  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [memory1File, setMemory1File] = useState<File | null>(null);
  const [memory2File, setMemory2File] = useState<File | null>(null);

  const [clearPrimary, setClearPrimary] = useState(false);
  const [clearMemory1, setClearMemory1] = useState(false);
  const [clearMemory2, setClearMemory2] = useState(false);

  const [existing, setExisting] = useState<Existing | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    if (!email) setEmail(user.email ?? "");

    let cancelled = false;
    async function load() {
      setLoadingExisting(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("classmates")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        toast(`Couldn't load your existing page: ${error.message}`, "error");
      } else if (data) {
        const row = data as Existing;
        setExisting(row);
        setName(row.name);
        setEmail(row.email);
        setPhone(row.phone ?? "");
        setBio(row.bio ?? "");
        setMessage(row.message ?? "");
        setRegNumber(row.reg_number ?? "");
      }
      setLoadingExisting(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  function handlePrimaryChange(file: File | null) {
    setPrimaryFile(file);
    if (file) setClearPrimary(false);
    else if (existing?.photo_url) setClearPrimary(true);
  }

  function handleMemory1Change(file: File | null) {
    setMemory1File(file);
    if (file) setClearMemory1(false);
    else if (existing?.photo_url_2) setClearMemory1(true);
  }

  function handleMemory2Change(file: File | null) {
    setMemory2File(file);
    if (file) setClearMemory2(false);
    else if (existing?.photo_url_3) setClearMemory2(true);
  }

  const primaryPresent =
    !!primaryFile || (!!existing?.photo_url && !clearPrimary);
  const valid =
    !!user && name.trim().length > 0 && email.trim().length > 0 && primaryPresent;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);

    const supabase = createClient();

    // Grab a fresh session so the RPC definitely carries a valid JWT.
    const { data: sessionData, error: sessionErr } =
      await supabase.auth.getSession();
    const session = sessionData?.session;

    if (sessionErr || !session?.user) {
      const msg = "Your session expired. Please log in again.";
      setError(msg);
      toast(msg, "error");
      return;
    }

    const userId = session.user.id;

    const cleanName = name.trim();
    if (cleanName.length < 2) {
      const msg = "Please enter your name before saving.";
      setError(msg);
      toast(msg, "error");
      return;
    }

    setSubmitting(true);
    setProgressStep(0);

    try {
      // Start from existing URLs, then override based on clears + uploads.
      let primaryUrl: string | null = clearPrimary
        ? null
        : existing?.photo_url ?? null;
      let memory1Url: string | null = clearMemory1
        ? null
        : existing?.photo_url_2 ?? null;
      let memory2Url: string | null = clearMemory2
        ? null
        : existing?.photo_url_3 ?? null;

      // Upload photos in parallel.
      const uploads: Promise<void>[] = [];
      if (primaryFile) {
        uploads.push(
          uploadPhoto(userId, "primary", primaryFile).then((url) => {
            primaryUrl = url;
          })
        );
      }
      if (memory1File) {
        uploads.push(
          uploadPhoto(userId, "memory-1", memory1File).then((url) => {
            memory1Url = url;
          })
        );
      }
      if (memory2File) {
        uploads.push(
          uploadPhoto(userId, "memory-2", memory2File).then((url) => {
            memory2Url = url;
          })
        );
      }

      if (uploads.length > 0) {
        setProgressStep(0);
        try {
          await Promise.all(uploads);
          toast(
            uploads.length === 1
              ? "Photo uploaded."
              : `${uploads.length} photos uploaded.`,
            "success"
          );
        } catch (upErr) {
          const msg =
            upErr instanceof Error ? upErr.message : "Upload failed.";
          toast(`Photo upload failed: ${msg}`, "error");
          throw upErr;
        }
      }

      // Delete any cleared photos from storage.
      const deletions: {
        slot: "primary" | "memory-1" | "memory-2";
        label: string;
      }[] = [];
      if (clearPrimary && !primaryFile) {
        deletions.push({ slot: "primary", label: "primary photo" });
      }
      if (clearMemory1 && !memory1File) {
        deletions.push({ slot: "memory-1", label: "memory photo 1" });
      }
      if (clearMemory2 && !memory2File) {
        deletions.push({ slot: "memory-2", label: "memory photo 2" });
      }

      for (const d of deletions) {
        try {
          await deletePhoto(userId, d.slot);
          toast(`Removed ${d.label}.`, "success");
        } catch (delErr) {
          const msg =
            delErr instanceof Error ? delErr.message : "Unknown error.";
          toast(`Couldn't remove ${d.label}: ${msg}`, "error");
          throw delErr;
        }
      }

      setProgressStep(1);

      // Save via the SECURITY DEFINER RPC. This bypasses RLS for the
      // row-selection logic, and the function verifies auth.uid() itself.
      const { data: newId, error: rpcErr } = await supabase.rpc(
        "upsert_my_classmate",
        {
          p_name: cleanName,
          p_email: email.trim(),
          p_phone: phone.trim() || null,
          p_bio: bio.trim() || null,
          p_message: message.trim() || null,
          p_photo_url: primaryUrl,
          p_photo_url_2: memory1Url,
          p_photo_url_3: memory2Url,
          p_reg_number: regNumber.trim() || null,
        }
      );

      if (rpcErr) {
        console.error("[save] rpc error:", rpcErr);
        toast(`Couldn't save your page: ${rpcErr.message}`, "error");
        throw rpcErr;
      }

      toast(existing ? "Changes saved." : "You're in the archive.", "success");

      setProgressStep(2);
      await new Promise((r) => setTimeout(r, 400));

      router.push(`/classmate/${newId}`);
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setError(msg);
      setSubmitting(false);
    }
  }

  if (authLoading || loadingExisting) {
    return (
      <p className="text-sm text-[color:var(--color-ink-soft)]">Loading…</p>
    );
  }

  if (!user) {
    return (
      <div className="rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-paper)] p-8 text-center">
        <p className="font-display text-xl font-medium">
          You need an account to do this.
        </p>
        <a
          href="/login"
          className="mt-4 inline-block rounded-photo bg-[color:var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[color:var(--color-primary-dark)]"
        >
          Log in
        </a>
      </div>
    );
  }

  return (
    <>
      {submitting && <UploadProgressOverlay step={progressStep} />}

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid gap-6 sm:grid-cols-3">
          <PhotoUploadSlot
            label="Primary photo"
            required
            hint="goes on your card"
            file={primaryFile}
            existingUrl={
              clearPrimary
                ? null
                : existing?.photo_url
                ? `${existing.photo_url}?v=${existing.updated_at}`
                : null
            }
            onSelect={handlePrimaryChange}
          />
          <PhotoUploadSlot
            label="Memory photo 1"
            hint="optional"
            file={memory1File}
            existingUrl={
              clearMemory1
                ? null
                : existing?.photo_url_2
                ? `${existing.photo_url_2}?v=${existing.updated_at}`
                : null
            }
            onSelect={handleMemory1Change}
          />
          <PhotoUploadSlot
            label="Memory photo 2"
            hint="optional"
            file={memory2File}
            existingUrl={
              clearMemory2
                ? null
                : existing?.photo_url_3
                ? `${existing.photo_url_3}?v=${existing.updated_at}`
                : null
            }
            onSelect={handleMemory2Change}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Registration number"
            value={regNumber}
            onChange={() => {}}
            placeholder={formatRegNumberExample()}
            readOnly
          />
          <Field
            label="Your name"
            required
            value={name}
            onChange={setName}
            placeholder="As you want it shown"
          />
        </div>

        <Field
          label="Email"
          type="email"
          required
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />

        <Field
          label="Phone"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="+1 555 123 4567 (optional)"
        />

        <Field
          label="A short bio"
          textarea
          value={bio}
          onChange={setBio}
          placeholder="Two sentences is plenty."
        />

        <Field
          label="A message to the class"
          textarea
          value={message}
          onChange={setMessage}
          placeholder="Anything you want to say. Optional."
        />

        {error && (
          <p className="rounded-photo border border-[color:var(--color-accent-warm)]/30 bg-[color:var(--color-accent-warm)]/10 px-4 py-3 text-sm text-[color:var(--color-accent-warm)]">
            {error}
          </p>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={!valid || submitting}
            className="rounded-photo bg-[color:var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {existing ? "Save changes" : "Complete registration"}
          </button>
          <p className="font-hand text-xl text-[color:var(--color-ink-soft)]">
            nothing is saved until you click
          </p>
        </div>
      </form>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  textarea,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]">
        {label}
        {required && (
          <span className="ml-1 text-[color:var(--color-accent-warm)]">*</span>
        )}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="mt-2 w-full resize-y rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-[15px] leading-[1.7] text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-primary)]"
        />
      ) : (
        <input
          type={type}
          value={value}
          required={required}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`mt-2 w-full rounded-photo border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-[15px] text-[color:var(--color-ink)] outline-none transition-colors focus:border-[color:var(--color-primary)] ${
            readOnly
              ? "cursor-not-allowed font-mono uppercase tracking-wide text-[color:var(--color-ink-soft)] opacity-80"
              : ""
          }`}
        />
      )}
    </label>
  );
}