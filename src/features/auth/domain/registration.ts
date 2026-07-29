/** Types partagés par le tunnel d'inscription étudiant (UI uniquement pour l'instant). */

export type StudentEligibilityValues = {
  matricule: string;
  university: string;
  academicYear: string;
};

export type CredentialsValues = {
  password: string;
  passwordConfirmation: string;
};

/** Règles de robustesse affichées sous les champs mot de passe. */
export const passwordRules = [
  { id: "length", label: "Au moins 8 caractères", test: (value: string) => value.length >= 8 },
  { id: "uppercase", label: "Au moins 1 majuscule", test: (value: string) => /[A-Z]/.test(value) },
  { id: "digit", label: "Au moins 1 chiffre", test: (value: string) => /\d/.test(value) },
  {
    id: "special",
    label: "Au moins 1 caractère spécial",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
] as const;

/** Universités partenaires proposées à l'étape d'éligibilité (données de démonstration). */
export const universities = [
  {
    uuid: "4c85b08e-54aa-466d-9fa3-d5575f66fedd",
    name: "Université de Kinshasa (UNIKIN)",
  },
] as const;

/** Années académiques ouvertes aux demandes d'inscription. */
export const academicYears = ["2024-2025", "2025-2026", "2026-2027"] as const;

export const defaultAcademicYear = "2026-2027";
