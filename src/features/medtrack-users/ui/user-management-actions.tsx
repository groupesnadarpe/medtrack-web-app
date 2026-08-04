"use client";

import { Download, Plus } from "lucide-react";
import { useState } from "react";
import type { ManagedUser } from "@/features/medtrack-users/domain/user-management";
import styles from "./user-management.module.css";

/** Exporte uniquement les lignes réellement reçues de l’API sur la page courante. */
export function UserManagementActions({ users }: Readonly<{ users: ManagedUser[] }>) {
  const [message, setMessage] = useState<string | null>(null);

  function exportCurrentPage() {
    const escape = (value: string | null | undefined) => `"${(value ?? "").replaceAll('"', '""')}"`;
    const rows = users.map((user) => [
      user.fullname,
      user.email,
      user.account_type,
      user.status,
      user.profile?.university_uuid ?? user.profile?.hospital_uuid,
      user.created_at,
    ]);
    const csv = [
      ["Nom", "Email", "Type de compte", "Statut", "Institution UUID", "Créé le"],
      ...rows,
    ].map((row) => row.map(escape).join(";")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `utilisateurs-medtrack-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.actionsBlock}>
      <div className={styles.actions}>
        <button type="button" className={styles.secondaryButton} onClick={exportCurrentPage} disabled={users.length === 0}>
          <Download aria-hidden="true" />
          Exporter
        </button>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => setMessage("La création doit passer par le workflow sécurisé du personnel de l’institution concernée.")}
        >
          <Plus aria-hidden="true" />
          Ajouter un utilisateur
        </button>
      </div>
      {message ? <p className={styles.actionNotice} role="status">{message}</p> : null}
    </div>
  );
}