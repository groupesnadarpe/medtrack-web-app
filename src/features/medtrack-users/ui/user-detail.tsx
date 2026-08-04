import { AlertTriangle, ChevronRight, Clock3, LogIn, UserRoundX } from "lucide-react";
import Link from "next/link";
import type { UserDetailData, UserDetailFailure, UserInternship } from "@/features/medtrack-users/domain/user-detail";
import { UserQuickActions } from "@/features/medtrack-users/ui/user-quick-actions";
import styles from "./user-detail.module.css";

const accountTypeLabels: Record<string, string> = {
  STUDENT: "Étudiant interné", MEDICAL_STAFF: "Personnel médical", UNIVERSITY_STAFF: "Personnel universitaire",
  HOSPITAL_ADMIN: "Admin hôpital", UNIVERSITY_ADMIN: "Admin université", MEDTRACK_ADMIN: "Admin Medtrack",
  MEDICAL_ORDER_ADMIN: "Admin Ordre", MINISTRY_AGENT: "Agent Ministère", SERVICE_ACCOUNT: "Compte service",
};
const statusLabels: Record<string, string> = {
  PENDING: "En attente", PENDING_VALIDATION: "À valider", ACTIVE: "Actif", SUSPENDED: "Suspendu",
  DISABLED: "Inactif", LOCKED: "Verrouillé", ARCHIVED: "Archivé",
};
const internshipStatusLabels: Record<string, string> = {
  PREPARING: "Préparation", READY_TO_START: "Prêt", IN_PROGRESS: "En cours", SUSPENDED: "Suspendu",
  INTERRUPTED: "Interrompu", AWAITING_EVALUATION: "À évaluer", AWAITING_REPORT: "Rapport attendu",
  AWAITING_ACADEMIC_VALIDATION: "À valider", COMPLETED: "Terminé", ACADEMICALLY_VALIDATED: "Validé",
  ACADEMICALLY_REJECTED: "Rejeté", CANCELLED: "Annulé", ARCHIVED: "Archivé",
};

function formatDate(value?: string | null, includeTime = false): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", includeTime
    ? { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }
    : { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function initials(name: string | null | undefined): string {
  return (name ?? "Utilisateur").split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function unitName(data: UserDetailData, uuid?: string | null): string {
  if (!uuid) return "—";
  return data.units.find((unit) => unit.uuid === uuid)?.name ?? uuid;
}

function Definition({ label, value }: Readonly<{ label: string; value?: string | null }>) {
  return <div className={styles.definition}><dt>{label}</dt><dd>{value || "—"}</dd></div>;
}

function ProfileCard({ data }: Readonly<{ data: UserDetailData }>) {
  const { user } = data;
  const profile = data.profile ?? user.profile;
  const role = data.authorization?.roles.find((item) => !item.status || item.status === "ACTIVE");
  return (
    <section className={`${styles.card} ${styles.profileCard}`}>
      <div className={styles.profileHeader}>
        <span className={styles.largeAvatar}>{initials(user.fullname)}</span>
        <div className={styles.profileHeading}>
          <div className={styles.nameLine}><h2>{user.fullname ?? "Utilisateur sans nom"}</h2><span className={styles.rolePill}>{role?.name ?? accountTypeLabels[user.account_type] ?? user.account_type}</span><span className={`${styles.statusPill} ${styles[`status_${user.status}`] ?? ""}`}>{statusLabels[user.status] ?? user.status}</span></div>
          <p>Inscrit le {formatDate(user.created_at)} · Matricule : {user.student_matricule_number ?? "Non renseigné"}</p>
        </div>
      </div>
      <div className={styles.divider} />
      <section><h3>Informations Personnelles</h3><dl className={styles.definitionGrid}>
        <Definition label="Nom" value={profile?.last_name} /><Definition label="Prénom" value={profile?.first_name} />
        <Definition label="Post-nom" value={profile?.middle_name} /><Definition label="Sexe" value={profile?.gender} />
        <Definition label="Email" value={user.email} /><Definition label="Téléphone" value={user.phone_number} />
        <Definition label="Date de naissance" value={data.profile?.birth_date ? formatDate(data.profile.birth_date) : null} /><Definition label="Dernière connexion" value={formatDate(user.last_login_at, true)} />
      </dl></section>
      <div className={styles.divider} />
      <section><h3>Informations Académiques</h3><dl className={styles.definitionGrid}>
        <Definition label="Université / Hôpital" value={data.institutionName} /><Definition label="Faculté / Service" value={unitName(data, data.profile?.faculty_uuid ?? data.profile?.service_uuid)} />
        <Definition label="Département" value={unitName(data, data.profile?.department_uuid)} /><Definition label="Promotion" value={data.profile?.promotion} />
        <Definition label="Année académique" value={data.profile?.academic_year} /><Definition label="Numéro matricule" value={user.student_matricule_number} />
      </dl></section>
    </section>
  );
}

function internshipDates(internship: UserInternship): string {
  const start = internship.actual_start_date ?? internship.planned_start_date;
  const end = internship.actual_end_date ?? internship.planned_end_date;
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function InternshipHistory({ internships, unavailable }: Readonly<{ internships: UserInternship[]; unavailable: boolean }>) {
  return <section className={`${styles.card} ${styles.internships}`}><div className={styles.sectionHeader}><h3>Historique de Stages</h3></div>
    {unavailable ? <p className={styles.sectionEmpty}>Internship-service est indisponible. Le profil reste consultable.</p> : internships.length === 0 ? <p className={styles.sectionEmpty}>Aucun stage enregistré pour cet utilisateur.</p> : <div className={styles.stageScroll}><table><thead><tr><th>Hôpital</th><th>Service</th><th>Période</th><th>Statut</th></tr></thead><tbody>{internships.map((internship) => <tr key={internship.uuid}><td>{internship.host_name_snapshot ?? internship.host_institution_uuid ?? "—"}</td><td>—</td><td>{internshipDates(internship)}</td><td><span className={`${styles.stageStatus} ${styles[`internship_${internship.status}`] ?? ""}`}>{internshipStatusLabels[internship.status ?? ""] ?? internship.status ?? "—"}</span></td></tr>)}</tbody></table></div>}
  </section>;
}

function RecentActivity({ data }: Readonly<{ data: UserDetailData }>) {
  const stages = data.internships.slice(0, 2);
  return <section className={styles.sideCard}><h3>Activité récente</h3><div className={styles.activityList}>
    {data.user.last_login_at ? <article className={styles.activity}><span><LogIn aria-hidden="true" /></span><div><strong>Dernière connexion</strong><time>{formatDate(data.user.last_login_at, true)}</time><p>Connexion réussie au compte.</p></div></article> : null}
    {stages.map((stage) => <article className={styles.activity} key={stage.uuid}><span><Clock3 aria-hidden="true" /></span><div><strong>Stage · {internshipStatusLabels[stage.status ?? ""] ?? stage.status}</strong><time>{formatDate(stage.status_changed_at ?? stage.created_at, true)}</time><p>{stage.host_name_snapshot ?? "Établissement non renseigné"}</p></div></article>)}
    {!data.user.last_login_at && stages.length === 0 ? <p className={styles.sectionEmpty}>Aucune activité exposée par les API.</p> : null}
  </div></section>;
}

export function UserDetail({ data }: Readonly<{ data: UserDetailData }>) {
  const internshipUnavailable = data.warnings.some((warning) => warning.service === "internships");
  return <div className={styles.page}>
    <nav className={styles.breadcrumb} aria-label="Fil d’Ariane"><Link href="/medtrack/users">Gestion Utilisateurs</Link><ChevronRight aria-hidden="true" /><strong>{data.user.fullname ?? "Utilisateur"}</strong></nav>
    {data.warnings.length ? <aside className={styles.warnings}><AlertTriangle aria-hidden="true" /><div><strong>Certaines données sont temporairement indisponibles.</strong><ul>{data.warnings.map((warning) => <li key={warning.service}>{warning.message}{warning.requestId ? ` · request_id : ${warning.requestId}` : ""}</li>)}</ul></div></aside> : null}
    <div className={styles.layout}><main className={styles.mainColumn}><ProfileCard data={data} /><InternshipHistory internships={data.internships} unavailable={internshipUnavailable} /></main><aside className={styles.sideColumn}><UserQuickActions userUuid={data.user.uuid} email={data.user.email} status={data.user.status} /><RecentActivity data={data} /></aside></div>
  </div>;
}

export function UserDetailError({ failure }: Readonly<{ failure: UserDetailFailure }>) {
  return <div className={styles.page}><nav className={styles.breadcrumb}><Link href="/medtrack/users">Gestion Utilisateurs</Link><ChevronRight aria-hidden="true" /><strong>Détail indisponible</strong></nav><section className={styles.fatalError}><UserRoundX aria-hidden="true" /><div><h2>{failure.kind === "not-found" ? "Utilisateur introuvable" : failure.kind === "forbidden" ? "Accès interdit" : "Auth-service indisponible"}</h2><p>{failure.message}</p>{failure.requestId ? <code>request_id : {failure.requestId}</code> : null}<Link href="/medtrack/users">Retour à la liste</Link></div></section></div>;
}