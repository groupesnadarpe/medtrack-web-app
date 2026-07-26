import type { EntityStatus, IsoDateString, Uuid } from "@/shared/types/common";
import type { UnknownRecord } from "@/core/api/api-types";

export type Gender = "MALE" | "FEMALE" | string;

export type Student = UnknownRecord & {
  uuid?: Uuid;
  user_uuid?: Uuid | null;
  student_matricule_number?: string;
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  gender?: Gender;
  birth_date?: IsoDateString | null;
  status?: EntityStatus;
};

export type University = UnknownRecord & {
  uuid?: Uuid;
  name?: string;
  code?: string;
};

export type Faculty = UnknownRecord & {
  uuid?: Uuid;
  university_uuid?: Uuid;
  name?: string;
  code?: string;
};

export type Department = UnknownRecord & {
  uuid?: Uuid;
  faculty_uuid?: Uuid;
  name?: string;
  code?: string;
};

export type AcademicYear = UnknownRecord & {
  uuid?: Uuid;
  name?: string;
  code?: string;
  starts_at?: IsoDateString;
  ends_at?: IsoDateString;
};

export type Program = UnknownRecord & {
  uuid?: Uuid;
  department_uuid?: Uuid;
  name?: string;
  code?: string;
};

export type Promotion = UnknownRecord & {
  uuid?: Uuid;
  program_uuid?: Uuid;
  academic_year_uuid?: Uuid;
  name?: string;
  code?: string;
};

export type Campaign = UnknownRecord & {
  uuid?: Uuid;
  name?: string;
  status?: EntityStatus;
};

export type Enrollment = UnknownRecord & {
  uuid?: Uuid;
  student_uuid?: Uuid;
  promotion_uuid?: Uuid;
  status?: EntityStatus;
};