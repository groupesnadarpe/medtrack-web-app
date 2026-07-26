import { actorAreas, type ActorKey } from "@/config/actors";

export type RoleCode =
  | "SUPER_ADMIN"
  | "MEDTRACK_ADMIN"
  | "UNIVERSITY_ADMIN"
  | "UNIVERSITY_AGENT"
  | "INTERNSHIP_COORDINATOR"
  | "HOSPITAL_ADMIN"
  | "DEPARTMENT_HEAD"
  | "INTERNSHIP_SUPERVISOR"
  | "FINANCE_OFFICER"
  | "STUDENT"
  | "MEDICAL_ORDER_ADMIN"
  | "MINISTRY_AGENT"
  | "SERVICE_ACCOUNT"
  | string;

export type RoleAccessRule = {
  role: RoleCode;
  actor: ActorKey | null;
  priority: number;
  description: string;
};

// Mapping canonique Front-end des rôles Back-end vers les espaces applicatifs.
// La sécurité réelle reste côté API/Kong; ce registre sert à router et à adapter l'interface.
export const roleAccessRules: RoleAccessRule[] = [
  {
    role: "SUPER_ADMIN",
    actor: "medtrack",
    priority: 10,
    description: "Administrateur global Medtrack.",
  },
  {
    role: "MEDTRACK_ADMIN",
    actor: "medtrack",
    priority: 20,
    description: "Administrateur interne Medtrack.",
  },
  {
    role: "UNIVERSITY_ADMIN",
    actor: "university",
    priority: 30,
    description: "Administrateur d'une université.",
  },
  {
    role: "INTERNSHIP_COORDINATOR",
    actor: "university",
    priority: 40,
    description: "Coordinateur de stages côté université.",
  },
  {
    role: "UNIVERSITY_AGENT",
    actor: "university",
    priority: 50,
    description: "Agent universitaire délégué.",
  },
  {
    role: "HOSPITAL_ADMIN",
    actor: "hospital",
    priority: 60,
    description: "Administrateur d'un hôpital.",
  },
  {
    role: "DEPARTMENT_HEAD",
    actor: "hospital",
    priority: 70,
    description: "Responsable de service hospitalier.",
  },
  {
    role: "INTERNSHIP_SUPERVISOR",
    actor: "hospital",
    priority: 80,
    description: "Encadreur de stage côté hôpital.",
  },
  {
    role: "FINANCE_OFFICER",
    actor: "hospital",
    priority: 90,
    description: "Agent financier rattaché au workflow institutionnel.",
  },
  {
    role: "MEDICAL_ORDER_ADMIN",
    actor: "ordre-de-medecin",
    priority: 100,
    description: "Administrateur de l'Ordre des médecins.",
  },
  {
    role: "MINISTRY_AGENT",
    actor: "ministere",
    priority: 110,
    description: "Agent du ministère.",
  },
  {
    role: "STUDENT",
    actor: "student",
    priority: 120,
    description: "Étudiant inscrit dans le parcours Medtrack.",
  },
  {
    role: "SERVICE_ACCOUNT",
    actor: null,
    priority: 999,
    description: "Compte technique interdit d'interface utilisateur.",
  },
];

export function normalizeRoleCode(role: string): string {
  return role.trim().toUpperCase();
}

export function ruleForRole(role: string): RoleAccessRule | null {
  const normalizedRole = normalizeRoleCode(role);
  const directRule = roleAccessRules.find((rule) => rule.role === normalizedRole);

  if (directRule) {
    return directRule;
  }

  // Tolérance pour les rôles custom créés par les admins locaux.
  // Exemple : UNIVERSITY_REPORT_VIEWER doit rester dans l'espace université.
  if (normalizedRole.startsWith("UNIVERSITY_")) {
    return customRule(normalizedRole, "university", 500);
  }

  if (normalizedRole.startsWith("HOSPITAL_")) {
    return customRule(normalizedRole, "hospital", 510);
  }

  if (normalizedRole.startsWith("MEDICAL_ORDER_")) {
    return customRule(normalizedRole, "ordre-de-medecin", 520);
  }

  if (normalizedRole.startsWith("MINISTRY_")) {
    return customRule(normalizedRole, "ministere", 530);
  }

  if (normalizedRole.startsWith("MEDTRACK_")) {
    return customRule(normalizedRole, "medtrack", 540);
  }

  return null;
}

export function actorsFromRoles(roles: string[]): ActorKey[] {
  const rules = roles
    .map(ruleForRole)
    .filter((rule): rule is RoleAccessRule => Boolean(rule?.actor))
    .sort((a, b) => a.priority - b.priority);

  return Array.from(new Set(rules.map((rule) => rule.actor).filter((actor): actor is ActorKey => Boolean(actor))));
}

export function canAccessActor(roles: string[], actor: ActorKey): boolean {
  return actorsFromRoles(roles).includes(actor);
}

export function defaultActorForRoles(roles: string[]): ActorKey | null {
  return actorsFromRoles(roles)[0] ?? null;
}

export function defaultPathForRoles(roles: string[]): string | null {
  const actor = defaultActorForRoles(roles);

  return actorAreas.find((area) => area.key === actor)?.path ?? null;
}

function customRule(role: string, actor: ActorKey, priority: number): RoleAccessRule {
  return {
    role,
    actor,
    priority,
    description: "Rôle custom rattaché par convention à un espace acteur.",
  };
}