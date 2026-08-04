import {
  Building2,
  GraduationCap,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import type {
  InstitutionOption,
  ManagedUser,
  UserFilters,
  UserListMeta,
  UserManagementAvailability,
} from "@/features/medtrack-users/domain/user-management";
import { UserManagementActions } from "@/features/medtrack-users/ui/user-management-actions";
import styles from "./user-management.module.css";

const accountTypeLabels: Record<string, string> = {
  STUDENT: "Étudiant",
  MEDICAL_STAFF: "Personnel médical",
  UNIVERSITY_STAFF: "Personnel universitaire",
  HOSPITAL_ADMIN: "Admin hôpital",
  UNIVERSITY_ADMIN: "Admin université",
  MEDTRACK_ADMIN: "Admin Medtrack",
  MEDICAL_ORDER_ADMIN: "Admin Ordre",
  MINISTRY_AGENT: "Agent Ministère",
  SERVICE_ACCOUNT: "Compte service",
};

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  PENDING_VALIDATION: "À valider",
  ACTIVE: "Actif",
  SUSPENDED: "Suspendu",
  DISABLED: "Inactif",
  LOCKED: "Verrouillé",
  ARCHIVED: "Archivé",
};

type Props = Readonly<{
  users: ManagedUser[];
  meta: UserListMeta;
  filters: UserFilters;
  institutions: InstitutionOption[];
  institutionsAvailable: boolean;
  availability: UserManagementAvailability;
}>;

function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function initialsFor(user: ManagedUser): string {
  const source = user.fullname ?? user.email ?? "Utilisateur";
  return source.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function institutionUuidFor(user: ManagedUser): string | null {
  return user.profile?.university_uuid ?? user.profile?.hospital_uuid ?? null;
}

function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  const value = new Date(date);
  return Number.isNaN(value.getTime())
    ? "—"
    : new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(value);
}

function pageHref(filters: UserFilters, page: number): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (filters.accountType) params.set("account_type", filters.accountType);
  if (filters.status) params.set("status", filters.status);
  if (filters.institutionUuid) params.set("institution_uuid", filters.institutionUuid);
  if (filters.search) params.set("search", filters.search);
  return `/medtrack/users?${params.toString()}`;
}

function Metrics({ meta }: Pick<Props, "meta">) {
  const cards = [
    { label: "Total Utilisateurs", value: meta.summary.total_users, icon: UsersRound, tone: "teal" },
    { label: "Étudiants Actifs", value: meta.summary.active_students, icon: GraduationCap, tone: "blue" },
    { label: "Superviseurs", value: meta.summary.supervisors, icon: Stethoscope, tone: "amber" },
    { label: "Administrateurs", value: meta.summary.administrators, icon: ShieldCheck, tone: "navy" },
  ] as const;

  return (
    <section className={styles.metrics} aria-label="Indicateurs utilisateurs">
      {cards.map(({ label, value, icon: Icon, tone }) => (
        <article className={styles.metricCard} key={label}>
          <span className={`${styles.metricIcon} ${styles[tone]}`}><Icon aria-hidden="true" /></span>
          <strong>{formatNumber(value)}</strong>
          <span>{label}</span>
        </article>
      ))}
    </section>
  );
}

function Filters({ filters, institutions, institutionsAvailable }: Pick<Props, "filters" | "institutions" | "institutionsAvailable">) {
  return (
    <form className={styles.filters} method="get">
      <strong>Filtrer par :</strong>
      <select name="account_type" defaultValue={filters.accountType ?? ""} aria-label="Filtrer par type de compte">
        <option value="">Tous les rôles</option>
        {Object.entries(accountTypeLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
      </select>
      <select name="status" defaultValue={filters.status ?? ""} aria-label="Filtrer par statut">
        <option value="">Tous les statuts</option>
        {Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
      </select>
      <select name="institution_uuid" defaultValue={filters.institutionUuid ?? ""} aria-label="Filtrer par institution" disabled={!institutionsAvailable}>
        <option value="">{institutionsAvailable ? "Toutes les institutions" : "Institutions indisponibles"}</option>
        {institutions.map((institution) => <option value={institution.uuid} key={institution.uuid}>{institution.name}</option>)}
      </select>
      <button type="submit" className={styles.filterButton}>Appliquer</button>
      <Link href="/medtrack/users" className={styles.reset}>Réinitialiser</Link>
    </form>
  );
}

function UsersTable({ users, institutions }: Pick<Props, "users" | "institutions">) {
  const institutionNames = new Map(institutions.map((institution) => [institution.uuid, institution.name]));

  if (users.length === 0) {
    return <div className={styles.emptyState}><UsersRound aria-hidden="true" /><strong>Aucun utilisateur trouvé</strong><p>Modifiez les filtres ou attendez la création des premiers comptes.</p></div>;
  }

  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead><tr><th>Nom &amp; Prénom</th><th>Email</th><th>Rôle</th><th>Institution</th><th>Statut</th><th>Date création</th></tr></thead>
        <tbody>
          {users.map((user) => {
            const institutionUuid = institutionUuidFor(user);
            const institutionName = institutionUuid ? institutionNames.get(institutionUuid) ?? institutionUuid : "Medtrack-RDC";
            return (
              <tr key={user.uuid} className={styles.clickableRow}>
                <td><span className={styles.identity}><span className={styles.avatar}>{initialsFor(user)}</span><Link className={styles.rowLink} href={`/medtrack/users/${user.uuid}`} aria-label={`Consulter ${user.fullname ?? "cet utilisateur"}`}>{user.fullname ?? "Utilisateur sans nom"}</Link></span></td>
                <td>{user.email ?? user.phone_number ?? user.student_matricule_number ?? "—"}</td>
                <td><span className={`${styles.roleBadge} ${styles[`role_${user.account_type}`] ?? ""}`}>{accountTypeLabels[user.account_type] ?? user.account_type}</span></td>
                <td><span className={styles.institution} title={institutionUuid ?? undefined}><Building2 aria-hidden="true" />{institutionName}</span></td>
                <td><span className={`${styles.statusBadge} ${styles[`status_${user.status}`] ?? ""}`}>{statusLabels[user.status] ?? user.status}</span></td>
                <td><time dateTime={user.created_at ?? undefined}>{formatDate(user.created_at)}</time></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Pagination({ meta, filters }: Pick<Props, "meta" | "filters">) {
  if (meta.last_page <= 1) return null;
  return (
    <nav className={styles.pagination} aria-label="Pagination des utilisateurs">
      <span>Page {meta.page} sur {meta.last_page} · {formatNumber(meta.total)} résultat(s)</span>
      <div>
        {meta.page > 1 ? <Link href={pageHref(filters, meta.page - 1)}>Précédent</Link> : <span aria-disabled="true">Précédent</span>}
        {meta.page < meta.last_page ? <Link href={pageHref(filters, meta.page + 1)}>Suivant</Link> : <span aria-disabled="true">Suivant</span>}
      </div>
    </nav>
  );
}

/** Reproduction responsive de la maquette, alimentée uniquement par les réponses réelles de l’API. */
export function UserManagement({ users, meta, filters, institutions, institutionsAvailable, availability }: Props) {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div><h2>Utilisateurs du Système</h2><p>Gérer les comptes des étudiants, des superviseurs académiques et des admins.</p></div>
        <UserManagementActions users={users} />
      </header>

      {availability.kind === "ready" ? <Metrics meta={meta} /> : null}
      <Filters filters={filters} institutions={institutions} institutionsAvailable={institutionsAvailable} />

      {availability.kind !== "ready" ? (
        <section className={styles.errorState} role="alert">
          <ShieldCheck aria-hidden="true" />
          <div><strong>{availability.kind === "forbidden" ? "Accès non autorisé" : "Auth-service indisponible"}</strong><p>{availability.message}</p>{availability.requestId ? <code>request_id : {availability.requestId}</code> : null}</div>
        </section>
      ) : (
        <section className={styles.tableCard} aria-label="Liste des utilisateurs">
          <UsersTable users={users} institutions={institutions} />
          <Pagination meta={meta} filters={filters} />
        </section>
      )}
    </div>
  );
}