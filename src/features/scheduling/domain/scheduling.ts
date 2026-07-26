import type { EntityStatus, IsoDateTimeString, Uuid } from "@/shared/types/common";
import type { UnknownRecord } from "@/core/api/api-types";
import type { AttendanceRecord } from "@/features/attendance/domain/attendance";

export type Schedule = UnknownRecord & {
  uuid?: Uuid;
  internship_uuid?: Uuid;
  status?: EntityStatus;
};

export type ScheduleEntry = UnknownRecord & {
  uuid?: Uuid;
  schedule_uuid?: Uuid;
  starts_at?: IsoDateTimeString;
  ends_at?: IsoDateTimeString;
};

export type GuardRequest = UnknownRecord & {
  uuid?: Uuid;
  internship_uuid?: Uuid;
  status?: EntityStatus;
};

export type { AttendanceRecord };