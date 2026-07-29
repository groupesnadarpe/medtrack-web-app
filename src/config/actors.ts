export type ActorKey =
  | "student"
  | "university"
  | "hospital"
  | "ordre-de-medecin"
  | "ministere"
  | "medtrack";

export type ActorArea = {
  key: ActorKey;
  label: string;
  path: `/${string}`;
  description: string;
};

// Registre unique des espaces applicatifs Medtrack.
// Les routes protégées, la navigation et les futures règles RBAC doivent s'appuyer dessus.
export const actorAreas: ActorArea[] = [
  {
    key: "student",
    label: "Étudiant",
    path: "/student",
    description: "Espace personnel de suivi du stage, des présences et des évaluations.",
  },
  {
    key: "university",
    label: "Université",
    path: "/university",
    description: "Dashboard des universités, facultés, départements et promotions.",
  },
  {
    key: "hospital",
    label: "Hôpital",
    path: "/hospital",
    description: "Espace des hôpitaux pour admissions, rotations, présences et encadrement.",
  },
  {
    key: "ordre-de-medecin",
    label: "Ordre des médecins",
    path: "/ordre-de-medecin",
    description: "Espace de validation, supervision professionnelle et conformité.",
  },
  {
    key: "ministere",
    label: "Ministère",
    path: "/ministere",
    description: "Espace institutionnel de pilotage, rapports et statistiques nationales.",
  },
  {
    key: "medtrack",
    label: "Admin Medtrack",
    path: "/medtrack",
    description: "Back-office interne Medtrack pour exploitation, support et audit.",
  },
];

export const protectedActorPaths = actorAreas.map((actor) => actor.path);
