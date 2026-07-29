import type { InstitutionType } from "@/features/institutions/domain/institution";

/**
 * Tunnel « demande de compte institutionnel » (3 étapes, UI uniquement pour l'instant).
 * Le demandeur devient l'administrateur de l'établissement une fois la demande validée.
 */

/** Seuls ces deux types d'établissements peuvent être demandés en self-service. */
export type RequestableInstitutionType = Extract<InstitutionType, string> & ("HOSPITAL" | "UNIVERSITY");

export type InstitutionTypeOption = {
  value: RequestableInstitutionType;
  title: string;
  description: string;
};

export const requestableInstitutionTypes: readonly InstitutionTypeOption[] = [
  {
    value: "HOSPITAL",
    title: "Hôpital / Clinique",
    description: "Centre hospitalier, clinique ou établissement de santé",
  },
  {
    value: "UNIVERSITY",
    title: "Université / Faculté",
    description: "Université, faculté de médecine ou institut de formation",
  },
];

/** Étape 1 : type d'établissement représenté. */
export type InstitutionTypeValues = {
  institutionType: RequestableInstitutionType | "";
};

/** Étape 2 : identité du futur administrateur. */
export type AdminIdentityValues = {
  lastName: string;
  postName: string;
  firstName: string;
  gender: string;
  email: string;
  phone: string;
  personalIdentifier: string;
  jobTitle: string;
};

/** Étape 3 : établissement déclaré + sécurisation du compte. */
export type InstitutionSecurityValues = {
  institutionName: string;
  password: string;
  passwordConfirmation: string;
  termsAccepted: boolean;
};

export const genderOptions = [
  { value: "MALE", label: "Masculin" },
  { value: "FEMALE", label: "Féminin" },
] as const;

/** Libellé du champ « Établissement » selon le type choisi à l'étape 1. */
export function institutionNamePlaceholder(type: InstitutionTypeValues["institutionType"]): string {
  return type === "UNIVERSITY" ? "Université de Kinshasa - Faculté de médecine" : "Hôpital Général de Référence de Kinshasa";
}

/** Délai d'instruction communiqué au demandeur. */
export const reviewDelayLabel = "Votre demande sera examinée sous 48h ouvrables";
