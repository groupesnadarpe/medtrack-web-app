export type ActorKey = "student" | "university" | "hospital" | "ordre-de-medecin" | "ministere" | "medtrack";

export type ActorArea = { key: ActorKey; label: string; path: `/${string}`; description: string };

// Registre unique des espaces applicatifs Medtrack.
// La navigation et les futures règles RBAC doivent toujours s'appuyer sur ce registre.
export const actorAreas: ActorArea[] = [
  { key: "student", label: "Étudiant", path: "/student", description: "Suivi personnel des stages, présences et évaluations." },
  { key: "university", label: "Université", path: "/university", description: "Gestion des étudiants, facultés, départements et promotions." },
  { key: "hospital", label: "Hôpital", path: "/hospital", description: "Gestion des admissions, rotations, présences et encadrement." },
  { key: "ordre-de-medecin", label: "Ordre des médecins", path: "/ordre-de-medecin", description: "Validation, supervision professionnelle et conformité." },
  { key: "ministere", label: "Ministère", path: "/ministere", description: "Pilotage institutionnel, rapports et statistiques nationales." },
  { key: "medtrack", label: "Admin Medtrack", path: "/medtrack", description: "Administration interne, exploitation, support et audit." },
];

export const protectedActorPaths = actorAreas.map((actor) => actor.path);