import type { ActorKey } from "@/config/actors";
import type { AuthUser } from "@/features/auth/domain/auth-user";

export type UiPermission =
  | "academic.students.read"
  | "academic.students.create"
  | "academic.students.import"
  | "admission.cases.read"
  | "admission.applications.manage"
  | "internship.read"
  | "internship.manage"
  | "scheduling.read"
  | "scheduling.manage"
  | "attendance.read"
  | "attendance.validate"
  | "assessment.read"
  | "assessment.evaluate"
  | "payment.read"
  | "payment.manage"
  | "media.read"
  | "media.upload"
  | "media.extract"
  | "notification.read"
  | "institution.read"
  | "institution.manage"
  | "users.read"
  | "staff.manage"
  | "reporting.read"
  | "support.manage"
  | "admin.accounts.validate";

export type UiActionState = {
  allowed: boolean;
  reason?: string;
};

const commonAuthenticatedPermissions: UiPermission[] = ["notification.read", "media.read"];

const rolePermissions: Record<string, UiPermission[]> = {
  SUPER_ADMIN: [
    "academic.students.read",
    "academic.students.create",
    "academic.students.import",
    "admission.cases.read",
    "admission.applications.manage",
    "internship.read",
    "internship.manage",
    "scheduling.read",
    "scheduling.manage",
    "attendance.read",
    "attendance.validate",
    "assessment.read",
    "assessment.evaluate",
    "payment.read",
    "payment.manage",
    "media.read",
    "media.upload",
    "media.extract",
    "notification.read",
    "institution.read",
    "institution.manage",
    "users.read",
    "staff.manage",
    "reporting.read",
    "support.manage",
    "admin.accounts.validate",
  ],
  MEDTRACK_ADMIN: ["institution.read", "institution.manage", "users.read", "staff.manage", "reporting.read", "support.manage", "admin.accounts.validate"],
  UNIVERSITY_ADMIN: ["academic.students.read", "academic.students.create", "academic.students.import", "institution.read", "staff.manage", "media.upload", "media.extract", "reporting.read"],
  UNIVERSITY_AGENT: ["academic.students.read", "academic.students.create", "media.upload", "media.extract"],
  INTERNSHIP_COORDINATOR: ["academic.students.read", "admission.cases.read", "internship.read", "scheduling.read", "assessment.read", "reporting.read"],
  HOSPITAL_ADMIN: ["admission.cases.read", "admission.applications.manage", "internship.read", "internship.manage", "scheduling.read", "scheduling.manage", "attendance.read", "attendance.validate", "assessment.read", "payment.read", "staff.manage", "reporting.read"],
  DEPARTMENT_HEAD: ["internship.read", "scheduling.read", "attendance.read", "attendance.validate", "assessment.read", "assessment.evaluate"],
  INTERNSHIP_SUPERVISOR: ["internship.read", "attendance.read", "assessment.read", "assessment.evaluate"],
  FINANCE_OFFICER: ["payment.read", "payment.manage", "reporting.read"],
  STUDENT: ["admission.cases.read", "internship.read", "scheduling.read", "attendance.read", "assessment.read", "payment.read", "media.upload"],
  MEDICAL_ORDER_ADMIN: ["institution.read", "reporting.read", "media.read"],
  MINISTRY_AGENT: ["institution.read", "admission.cases.read", "internship.read", "assessment.read", "reporting.read"],
};

const actorPermissions: Record<ActorKey, UiPermission[]> = {
  student: ["admission.cases.read", "internship.read", "scheduling.read", "attendance.read", "assessment.read", "payment.read", "media.upload", "notification.read"],
  university: ["academic.students.read", "academic.students.create", "academic.students.import", "admission.cases.read", "internship.read", "scheduling.read", "assessment.read", "media.upload", "media.extract", "staff.manage", "reporting.read", "notification.read"],
  hospital: ["admission.cases.read", "admission.applications.manage", "internship.read", "internship.manage", "scheduling.read", "scheduling.manage", "attendance.read", "attendance.validate", "assessment.read", "assessment.evaluate", "payment.read", "staff.manage", "reporting.read", "notification.read"],
  "ordre-de-medecin": ["institution.read", "reporting.read", "media.read", "notification.read"],
  ministere: ["institution.read", "admission.cases.read", "internship.read", "assessment.read", "reporting.read", "notification.read"],
  medtrack: ["institution.read", "institution.manage", "users.read", "staff.manage", "support.manage", "admin.accounts.validate", "reporting.read", "notification.read"],
};

function normalizeRole(role: string): string {
  return role.trim().toUpperCase();
}

export function permissionsFromRoles(roles: string[]): UiPermission[] {
  const permissions = new Set<UiPermission>(commonAuthenticatedPermissions);

  for (const role of roles.map(normalizeRole)) {
    for (const permission of rolePermissions[role] ?? []) {
      permissions.add(permission);
    }
  }

  return [...permissions];
}

export function hasUiPermission(user: Pick<AuthUser, "roles"> | null | undefined, permission: UiPermission): boolean {
  if (!user) return false;

  return permissionsFromRoles(user.roles).includes(permission);
}

export function canUseActorPermission(user: Pick<AuthUser, "roles" | "actorAreas"> | null | undefined, actor: ActorKey, permission: UiPermission): UiActionState {
  if (!user) {
    return { allowed: false, reason: "Session absente." };
  }

  if (!user.actorAreas.includes(actor)) {
    return { allowed: false, reason: "Cet utilisateur n'a pas accès à cet espace." };
  }

  if (!actorPermissions[actor].includes(permission)) {
    return { allowed: false, reason: "Cette action n'est pas disponible dans cet espace." };
  }

  if (!hasUiPermission(user, permission)) {
    return { allowed: false, reason: "Autorisation insuffisante." };
  }

  return { allowed: true };
}

// Important : ces helpers améliorent l'expérience utilisateur, mais ne remplacent jamais les contrôles Back-end/Kong.
export function explainDisabledAction(state: UiActionState): string | undefined {
  return state.allowed ? undefined : state.reason ?? "Action non autorisée.";
}