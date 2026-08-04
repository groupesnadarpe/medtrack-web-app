import type { ActorKey } from "@/config/actors";
import type { UiPermission } from "@/core/permissions/ui-permissions";

export type NavigationItem = {
  label: string;
  href: `/${string}`;
  permission?: UiPermission;
};

// Chaque entrée reste alignée avec une permission Back-end ; l'UI ne remplace jamais le contrôle serveur.
export const actorNavigation: Record<ActorKey, NavigationItem[]> = {
  student: [
    { label: "Tableau de bord", href: "/student" },
    { label: "Admissions", href: "/student/admissions", permission: "admission.cases.read" },
    { label: "Stages", href: "/student/internships", permission: "internship.read" },
    { label: "Présences", href: "/student/attendance", permission: "attendance.read" },
    { label: "Évaluations", href: "/student/assessments", permission: "assessment.read" },
    { label: "Paiements", href: "/student/payments", permission: "payment.read" },
    { label: "Médias", href: "/student/media", permission: "media.read" },
  ],
  university: [
    { label: "Tableau de bord", href: "/university" },
    { label: "Étudiants", href: "/university/students", permission: "academic.students.read" },
    { label: "Académique", href: "/university/academic", permission: "academic.students.read" },
    { label: "Admissions", href: "/university/admissions", permission: "admission.cases.read" },
    { label: "Stages", href: "/university/internships", permission: "internship.read" },
    { label: "Médias", href: "/university/media", permission: "media.read" },
    { label: "Équipe", href: "/university/team", permission: "staff.manage" },
  ],
  hospital: [
    { label: "Tableau de bord", href: "/hospital" },
    { label: "Admissions", href: "/hospital/admissions", permission: "admission.cases.read" },
    { label: "Stages", href: "/hospital/internships", permission: "internship.read" },
    { label: "Planning", href: "/hospital/scheduling", permission: "scheduling.read" },
    { label: "Présences", href: "/hospital/attendance", permission: "attendance.read" },
    { label: "Évaluations", href: "/hospital/assessments", permission: "assessment.read" },
    { label: "Finance", href: "/hospital/finance", permission: "payment.read" },
  ],
  "ordre-de-medecin": [
    { label: "Tableau de bord", href: "/ordre-de-medecin" },
    { label: "Institutions", href: "/ordre-de-medecin/institutions", permission: "institution.read" },
    { label: "Rapports", href: "/ordre-de-medecin/reports", permission: "reporting.read" },
  ],
  ministere: [
    { label: "Tableau de bord", href: "/ministere" },
    { label: "Institutions", href: "/ministere/institutions", permission: "institution.read" },
    { label: "Admissions", href: "/ministere/admissions", permission: "admission.cases.read" },
    { label: "Rapports", href: "/ministere/reports", permission: "reporting.read" },
  ],
  medtrack: [
    { label: "Tableau de bord", href: "/medtrack" },
    { label: "Gestion Utilisateurs", href: "/medtrack/users", permission: "users.read" },
    { label: "Validations", href: "/medtrack/account-validations", permission: "admin.accounts.validate" },
    { label: "Institutions", href: "/medtrack/institutions", permission: "institution.read" },
    { label: "Support", href: "/medtrack/support", permission: "support.manage" },
    { label: "Rapports", href: "/medtrack/reports", permission: "reporting.read" },
  ],
};