import type { EntityStatus, Uuid } from "@/shared/types/common";
import type { UnknownRecord } from "@/core/api/api-types";

export type InstitutionType = "UNIVERSITY" | "HOSPITAL" | "MEDICAL_ORDER" | "MINISTRY" | "MEDTRACK" | string;

export type Institution = UnknownRecord & {
  uuid?: Uuid;
  name?: string;
  code?: string;
  type?: InstitutionType;
  status?: EntityStatus;
};

export type InstitutionUnit = UnknownRecord & {
  uuid?: Uuid;
  institution_uuid?: Uuid;
  name?: string;
  code?: string;
};

export type InstitutionAddress = UnknownRecord & {
  uuid?: Uuid;
  institution_uuid?: Uuid;
  city?: string;
  country?: string;
};

export type InstitutionContact = UnknownRecord & {
  uuid?: Uuid;
  institution_uuid?: Uuid;
  email?: string | null;
  phone?: string | null;
};