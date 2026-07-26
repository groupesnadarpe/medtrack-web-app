import type { EntityStatus, IsoDateTimeString, Uuid } from "@/shared/types/common";
import type { UnknownRecord } from "@/core/api/api-types";

export type InternshipCase = UnknownRecord & {
  uuid?: Uuid;
  student_uuid?: Uuid;
  campaign_uuid?: Uuid;
  status?: EntityStatus;
};

export type AdmissionApplication = UnknownRecord & {
  uuid?: Uuid;
  case_uuid?: Uuid;
  hospital_uuid?: Uuid;
  status?: EntityStatus;
  submitted_at?: IsoDateTimeString | null;
};

export type CapacityPool = UnknownRecord & {
  uuid?: Uuid;
  hospital_uuid?: Uuid;
  capacity?: number;
  reserved_capacity?: number;
  status?: EntityStatus;
};