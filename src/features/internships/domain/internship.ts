import type { EntityStatus, IsoDateString, Uuid } from "@/shared/types/common";
import type { UnknownRecord } from "@/core/api/api-types";

export type Internship = UnknownRecord & {
  uuid?: Uuid;
  student_uuid?: Uuid;
  hospital_uuid?: Uuid;
  status?: EntityStatus;
  starts_at?: IsoDateString | null;
  ends_at?: IsoDateString | null;
};

export type Rotation = UnknownRecord & {
  uuid?: Uuid;
  internship_uuid?: Uuid;
  department_uuid?: Uuid;
  status?: EntityStatus;
  starts_at?: IsoDateString | null;
  ends_at?: IsoDateString | null;
};

export type PathTemplate = UnknownRecord & {
  uuid?: Uuid;
  name?: string;
  status?: EntityStatus;
};