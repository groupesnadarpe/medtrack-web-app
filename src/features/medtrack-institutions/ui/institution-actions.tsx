"use client";

import { Check, Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import type { ManagedInstitution, VerificationStatus } from "@/features/medtrack-institutions/domain/institution-management";
import styles from "./institution-management.module.css";

type Feedback = { kind: "success" | "error"; message: string; requestId?: string } | null;

async function readFailure(response: Response): Promise<Feedback> {
  const body = await response.json().catch(() => ({})) as { detail?: string; title?: string; message?: string; request_id?: string };
  return { kind: "error", message: body.detail ?? body.title ?? body.message ?? "L’action n’a pas pu être effectuée.", requestId: body.request_id };
}

/** Mutations institutionnelles : le navigateur ne reçoit jamais le JWT de la session. */
export function InstitutionActions({ institution, canManage }: Readonly<{ institution?: ManagedInstitution; canManage: boolean }>) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<VerificationStatus | "CREATE" | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  async function verify(verificationStatus: VerificationStatus) {
    if (!institution || busy) return;
    setBusy(verificationStatus); setFeedback(null);
    const response = await fetch(`/api/institutions/${institution.uuid}/verification`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ verification_status: verificationStatus }) });
    if (!response.ok) setFeedback(await readFailure(response));
    else { setFeedback({ kind: "success", message: verificationStatus === "VERIFIED" ? "Institution vérifiée." : "Institution rejetée." }); router.refresh(); }
    setBusy(null);
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    setBusy("CREATE"); setFeedback(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/institutions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
    if (!response.ok) setFeedback(await readFailure(response));
    else { setOpen(false); setFeedback({ kind: "success", message: "Institution créée." }); router.refresh(); event.currentTarget.reset(); }
    setBusy(null);
  }

  if (!institution) return (
    <>
      <button className={styles.primaryButton} type="button" onClick={() => setOpen(true)} disabled={!canManage}><Plus aria-hidden="true" />Ajouter une institution</button>
      {feedback ? <p className={feedback.kind === "error" ? styles.feedbackError : styles.feedbackSuccess}>{feedback.message}{feedback.requestId ? ` · request_id ${feedback.requestId}` : ""}</p> : null}
      {open ? <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setOpen(false)}><section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="new-institution-title" onMouseDown={(event) => event.stopPropagation()}><header><div><h3 id="new-institution-title">Nouvelle institution</h3><p>Renseignez les informations officielles de l’établissement.</p></div><button type="button" className={styles.iconButton} onClick={() => setOpen(false)} aria-label="Fermer"><X /></button></header><form onSubmit={create} className={styles.modalForm}><label>Type<select name="institution_type" required defaultValue=""><option value="" disabled>Sélectionner</option><option value="UNIVERSITY">Université</option><option value="HOSPITAL">Hôpital</option><option value="CLINIC">Clinique</option><option value="HEALTH_CENTER">Centre de santé</option><option value="MINISTRY">Ministère</option><option value="MEDICAL_ORDER">Ordre des médecins</option><option value="OTHER">Autre</option></select></label><label>Nom légal<input name="legal_name" required minLength={2} maxLength={255} /></label><label>Nom d’affichage<input name="display_name" maxLength={255} /></label><label>Code officiel<input name="official_code" maxLength={100} /></label><label>Numéro d’enregistrement<input name="registration_number" maxLength={150} /></label><label className={styles.fullField}>Description<textarea name="description" maxLength={2000} rows={3} /></label><div className={styles.modalFooter}><button type="button" className={styles.secondaryButton} onClick={() => setOpen(false)}>Annuler</button><button type="submit" className={styles.primaryButton} disabled={Boolean(busy)}>{busy === "CREATE" ? <Loader2 className={styles.spin} /> : <Plus />}Créer</button></div></form></section></div> : null}
    </>
  );

  return <div className={styles.rowActions}><button type="button" title="Vérifier" aria-label={`Vérifier ${institution.legal_name}`} onClick={() => verify("VERIFIED")} disabled={!canManage || Boolean(busy)}><Check /></button><button type="button" title="Rejeter" aria-label={`Rejeter ${institution.legal_name}`} className={styles.dangerAction} onClick={() => verify("REJECTED")} disabled={!canManage || Boolean(busy)}><X /></button>{feedback?.kind === "error" ? <span title={feedback.requestId ? `request_id ${feedback.requestId}` : undefined}>!</span> : null}</div>;
}