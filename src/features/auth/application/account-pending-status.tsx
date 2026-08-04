"use client";

import { Clock3, FileQuestion, MailCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { routes } from "@/core/routing/routes";
import { cn } from "@/shared/ui/utils";

type SubmittedValidation = {
  request_uuid?: string;
  onboarding_request_uuid?: string;
  status?: string;
  institution_name?: string;
  email?: string;
};

const primaryButtonClassName =
  "inline-flex h-14 w-full items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground transition hover:bg-primary-strong focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2";

/**
 * Confirme uniquement la demande déposée depuis ce navigateur.
 * Aucun mot de passe ni jeton d'onboarding n'est conservé côté client.
 */
export function AccountPendingStatus() {
  const [loading, setLoading] = useState(true);
  const [validation, setValidation] = useState<SubmittedValidation | null>(null);

  useEffect(() => {
    const raw = window.sessionStorage.getItem("medtrack.pending-account-validation");

    if (raw) {
      try {
        setValidation(JSON.parse(raw) as SubmittedValidation);
      } catch {
        setValidation(null);
      }
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div className="h-96 animate-pulse rounded-3xl border border-border/70 bg-muted/60" />;
  }

  if (!validation) {
    return (
      <div className="w-full rounded-3xl border border-border/70 bg-card p-8 text-center shadow-[0_24px_60px_-40px_rgba(22,38,74,0.35)] sm:p-10">
        <FileQuestion className="mx-auto size-14 text-muted-foreground" aria-hidden="true" />
        <h1 className="mt-5 font-display text-3xl font-extrabold text-foreground">Aucune demande récente</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Aucune confirmation de demande n’est disponible dans ce navigateur.
        </p>
        <Link href={routes.institutionRegister} className={cn(primaryButtonClassName, "mt-7")}>
          Déposer une demande
        </Link>
        <p className="mt-6">
          <Link href={routes.login} className="font-semibold text-primary-strong hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-3xl border border-border/70 bg-card p-8 text-center shadow-[0_24px_60px_-40px_rgba(22,38,74,0.35)] sm:p-10">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
        <ShieldCheck className="size-8" aria-hidden="true" />
      </span>

      <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-foreground">
        Demande envoyée
      </h1>

      <p className="mt-3 leading-relaxed text-muted-foreground">
        Votre demande de création de compte institutionnel a bien été transmise à l’équipe Medtrack.
      </p>

      <div className="mt-6 rounded-2xl border border-primary/15 bg-primary-soft/60 p-5 text-left">
        <div className="flex items-start gap-3">
          <MailCheck className="mt-0.5 size-5 shrink-0 text-primary-strong" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-foreground">
            Vous recevrez un email à
            {validation.email ? <strong> {validation.email}</strong> : " l’adresse renseignée"} dès que votre demande aura été validée.
          </p>
        </div>
      </div>

      {validation.institution_name ? (
        <p className="mt-5 text-sm text-muted-foreground">
          Établissement : <strong className="text-foreground">{validation.institution_name}</strong>
        </p>
      ) : null}

      {validation.request_uuid ? (
        <p className="mt-2 break-all text-xs text-muted-foreground">
          Référence : {validation.request_uuid}
        </p>
      ) : null}

      <p className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Clock3 className="size-4" aria-hidden="true" />
        Délai indicatif : 48 heures ouvrables
      </p>

      <Link href={routes.login} className={cn(primaryButtonClassName, "mt-7")}>
        Retour à la connexion
      </Link>
    </div>
  );
}