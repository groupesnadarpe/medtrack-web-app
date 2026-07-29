/** Types partagés par le tunnel d'inscription (UI uniquement pour l'instant). */

export type InstitutionType = "hospital" | "university";

export type InstitutionTypeOption = {
  value: InstitutionType;
  label: string;
  description: string;
};

export const institutionTypeOptions: InstitutionTypeOption[] = [
  {
    value: "hospital",
    label: "Hôpital / Clinique",
    description: "Centre hospitalier, clinique ou établissement de santé",
  },
  {
    value: "university",
    label: "Université / Faculté",
    description: "Université, faculté de médecine ou institut de formation",
  },
];

export type InstitutionIdentityValues = {
  name: string;
  officialId: string;
  email: string;
  phone: string;
  province: string;
  responsibleName: string;
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

export const congoProvinces = [
  "Kinshasa",
  "Kongo-Central",
  "Kwango",
  "Kwilu",
  "Mai-Ndombe",
  "Kasaï",
  "Kasaï-Central",
  "Kasaï-Oriental",
  "Lomami",
  "Sankuru",
  "Maniema",
  "Sud-Kivu",
  "Nord-Kivu",
  "Ituri",
  "Haut-Uele",
  "Tshopo",
  "Bas-Uele",
  "Nord-Ubangi",
  "Mongala",
  "Sud-Ubangi",
  "Équateur",
  "Tshuapa",
  "Tanganyika",
  "Haut-Lomami",
  "Lualaba",
  "Haut-Katanga",
] as const;
