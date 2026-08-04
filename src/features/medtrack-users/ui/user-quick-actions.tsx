"use client";

import { Bell, KeyRound, Loader2, Power, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import styles from "./user-detail.module.css";

type Props = Readonly<{ userUuid: string; email?: string | null; status: string }>;
type Feedback = { kind: "success" | "error"; message: string; requestId?: string | null };

async function responseFailure(response: Response): Promise<Feedback> {
  const payload = await response.json().catch(() => null);
  return {
    kind: "error",
    message: payload?.detail ?? payload?.message ?? payload?.title ?? "L’action n’a pas pu être effectuée.",
    requestId: payload?.request_id,
  };
}

/** Actions réelles de la fiche ; les permissions restent contrôlées par Kong et auth-service. */
export function UserQuickActions({ userUuid, email, status }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);

  async function requestPasswordReset() {
    if (!email) return;
    setPending("password"); setFeedback(null);
    try {
      const response = await fetch("/api/auth/password-forgot", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setFeedback(response.ok ? { kind: "success", message: "Les instructions de réinitialisation ont été demandées." } : await responseFailure(response));
    } catch {
      setFeedback({ kind: "error", message: "Auth-service est indisponible." });
    } finally { setPending(null); }
  }

  async function changeStatus() {
    const nextStatus = status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    const confirmed = window.confirm(nextStatus === "DISABLED" ? "Désactiver ce compte et révoquer ses sessions ?" : "Réactiver ce compte ?");
    if (!confirmed) return;
    setPending("status"); setFeedback(null);
    try {
      const response = await fetch(`/api/auth/users/${userUuid}/status`, {
        method: "PATCH",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) setFeedback(await responseFailure(response));
      else { setFeedback({ kind: "success", message: nextStatus === "ACTIVE" ? "Compte réactivé." : "Compte désactivé et sessions révoquées." }); router.refresh(); }
    } catch { setFeedback({ kind: "error", message: "Auth-service est indisponible." }); }
    finally { setPending(null); }
  }

  async function sendNotification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending("notification"); setFeedback(null);
    try {
      const response = await fetch("/api/notifications/manual", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ userUuid, title: form.get("title"), body: form.get("body") }),
      });
      if (!response.ok) setFeedback(await responseFailure(response));
      else { setFeedback({ kind: "success", message: "Notification envoyée." }); setNotificationOpen(false); }
    } catch { setFeedback({ kind: "error", message: "Notification-service est indisponible." }); }
    finally { setPending(null); }
  }

  return (
    <>
      <section className={styles.sideCard}>
        <h3>Actions rapides</h3>
        <div className={styles.quickActions}>
          <button type="button" onClick={requestPasswordReset} disabled={!email || Boolean(pending)}><KeyRound aria-hidden="true" />{pending === "password" ? "Envoi..." : "Réinitialiser mot de passe"}</button>
          <button type="button" onClick={() => setNotificationOpen(true)} disabled={Boolean(pending)}><Bell aria-hidden="true" />Envoyer notification</button>
          <button type="button" className={status === "ACTIVE" ? styles.dangerAction : styles.activateAction} onClick={changeStatus} disabled={Boolean(pending)}>
            {pending === "status" ? <Loader2 className={styles.spin} aria-hidden="true" /> : <Power aria-hidden="true" />}
            {status === "ACTIVE" ? "Désactiver le compte" : "Réactiver le compte"}
          </button>
        </div>
        {feedback ? <p className={feedback.kind === "success" ? styles.successFeedback : styles.errorFeedback} role="status">{feedback.message}{feedback.requestId ? ` Référence : ${feedback.requestId}` : ""}</p> : null}
      </section>

      {notificationOpen ? (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setNotificationOpen(false)}>
          <form className={styles.modal} onSubmit={sendNotification} onMouseDown={(event) => event.stopPropagation()}>
            <div className={styles.modalHeader}><h3>Envoyer une notification</h3><button type="button" onClick={() => setNotificationOpen(false)} aria-label="Fermer"><X aria-hidden="true" /></button></div>
            <label>Titre<input name="title" required minLength={2} maxLength={200} /></label>
            <label>Message<textarea name="body" required minLength={2} maxLength={2000} rows={5} /></label>
            <button className={styles.modalSubmit} type="submit" disabled={pending === "notification"}>{pending === "notification" ? "Envoi..." : "Envoyer"}</button>
          </form>
        </div>
      ) : null}
    </>
  );
}