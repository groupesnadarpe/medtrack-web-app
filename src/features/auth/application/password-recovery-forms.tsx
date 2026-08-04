"use client";

import { AlertCircle, CheckCircle2, KeyRound, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { routes } from "@/core/routing/routes";

const inputClassName = "w-full rounded-full border border-input bg-background py-3.5 pl-12 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30";
const buttonClassName = "inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-primary-foreground transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-70";

type ApiFailure = { message: string; requestId?: string | null };

function ApiErrorMessage({ failure }: Readonly<{ failure: ApiFailure | null }>) {
  if (!failure) return null;
  return (
    <div role="alert" className="rounded-2xl bg-destructive-soft px-4 py-3 text-sm text-destructive">
      <p className="flex items-start gap-2 font-semibold"><AlertCircle className="mt-0.5 size-4 shrink-0" />{failure.message}</p>
      {failure.requestId ? <p className="mt-2 text-xs">Référence support : {failure.requestId}</p> : null}
    </div>
  );
}

function RecoveryCard({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="w-full rounded-3xl border border-border/70 bg-card p-8 shadow-[0_24px_60px_-40px_rgba(22,38,74,0.35)] sm:p-10">{children}</div>;
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState<ApiFailure | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFailure(null);

    try {
      const response = await fetch("/api/auth/password-forgot", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setFailure({ message: payload?.detail ?? payload?.message ?? payload?.title ?? "Impossible de traiter la demande.", requestId: payload?.request_id });
        return;
      }

      // Message volontairement neutre pour ne pas révéler l'existence d'un compte.
      setSent(true);
    } catch {
      setFailure({ message: "Auth-service est momentanément indisponible. Réessayez dans quelques instants." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <RecoveryCard>
      {sent ? (
        <div className="text-center">
          <CheckCircle2 className="mx-auto size-14 text-success" />
          <h1 className="mt-5 font-display text-3xl font-extrabold text-foreground">Demande enregistrée</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">Si cette adresse correspond à un compte, les instructions de réinitialisation lui seront envoyées.</p>
          <Link href={routes.login} className={`${buttonClassName} mt-7`}>Retour à la connexion</Link>
        </div>
      ) : (
        <>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Mot de passe oublié</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">Renseignez l’adresse email liée à votre compte.</p>
          <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
              Adresse email
              <span className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" /><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClassName} placeholder="utilisateur@exemple.cd" /></span>
            </label>
            <ApiErrorMessage failure={failure} />
            <button type="submit" disabled={submitting} className={buttonClassName}>{submitting ? <Loader2 className="size-5 animate-spin" /> : null}{submitting ? "Envoi en cours..." : "Recevoir les instructions"}</button>
          </form>
          <p className="mt-6 text-center"><Link href={routes.login} className="font-semibold text-primary-strong hover:underline">Retour à la connexion</Link></p>
        </>
      )}
    </RecoveryCard>
  );
}

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState<ApiFailure | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Le jeton est conservé en mémoire puis retiré de l'URL pour limiter son exposition.
    if (searchParams.has("token")) window.history.replaceState({}, "", routes.resetPassword);
  }, [searchParams]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFailure(null);
    if (password !== confirmation) {
      setFailure({ message: "Les deux mots de passe ne correspondent pas." });
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, new_password: password, new_password_confirmation: confirmation }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setFailure({ message: payload?.detail ?? payload?.message ?? payload?.title ?? "Le lien est invalide ou expiré.", requestId: payload?.request_id });
        return;
      }
      setCompleted(true);
    } catch {
      setFailure({ message: "Auth-service est momentanément indisponible. Réessayez dans quelques instants." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <RecoveryCard>
      {completed ? (
        <div className="text-center"><CheckCircle2 className="mx-auto size-14 text-success" /><h1 className="mt-5 font-display text-3xl font-extrabold text-foreground">Mot de passe modifié</h1><p className="mt-3 text-muted-foreground">Vous pouvez maintenant utiliser votre nouveau mot de passe.</p><Link href={routes.login} className={`${buttonClassName} mt-7`}>Se connecter</Link></div>
      ) : (
        <><h1 className="font-display text-3xl font-extrabold text-foreground">Nouveau mot de passe</h1><p className="mt-3 text-muted-foreground">Saisissez les informations reçues dans le message de récupération.</p><form onSubmit={submit} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-semibold">Adresse email<span className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={inputClassName} /></span></label>
          <label className="flex flex-col gap-2 text-sm font-semibold">Jeton de réinitialisation<span className="relative"><KeyRound className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" /><input required value={token} onChange={(event) => setToken(event.target.value)} className={inputClassName} /></span></label>
          <label className="flex flex-col gap-2 text-sm font-semibold">Nouveau mot de passe<input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className={`${inputClassName} pl-4`} /></label>
          <label className="flex flex-col gap-2 text-sm font-semibold">Confirmer le mot de passe<input type="password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className={`${inputClassName} pl-4`} /></label>
          <ApiErrorMessage failure={failure} />
          <button type="submit" disabled={submitting} className={buttonClassName}>{submitting ? <Loader2 className="size-5 animate-spin" /> : null}{submitting ? "Validation..." : "Réinitialiser le mot de passe"}</button>
        </form><p className="mt-6 text-center"><Link href={routes.login} className="font-semibold text-primary-strong hover:underline">Retour à la connexion</Link></p></>
      )}
    </RecoveryCard>
  );
}