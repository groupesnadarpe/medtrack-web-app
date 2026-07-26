import type { EntityStatus, IsoDateTimeString, Uuid } from "@/shared/types/common";
import type { UnknownRecord } from "@/core/api/api-types";

export type AttendanceRecord = UnknownRecord & {
  uuid?: Uuid;
  internship_uuid?: Uuid;
  rotation_uuid?: Uuid | null;
  student_uuid?: Uuid;
  checked_in_at?: IsoDateTimeString | null;
  checked_out_at?: IsoDateTimeString | null;
  status?: EntityStatus;
};

export type AttendanceCorrection = UnknownRecord & {
  uuid?: Uuid;
  attendance_uuid?: Uuid;
  status?: EntityStatus;
  reason?: string;
};