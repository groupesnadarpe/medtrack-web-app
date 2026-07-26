import type { EntityStatus, IsoDateTimeString, Uuid } from "@/shared/types/common";
import type { UnknownRecord } from "@/core/api/api-types";

export type MediaFile = UnknownRecord & {
  uuid?: Uuid;
  name?: string;
  mime_type?: string;
  size?: number;
  status?: EntityStatus;
  created_at?: IsoDateTimeString;
};

export type UploadSession = UnknownRecord & {
  uuid?: Uuid;
  status?: EntityStatus;
};

export type MediaProcessingJob = UnknownRecord & {
  uuid?: Uuid;
  status?: EntityStatus;
  result?: unknown;
};

export type SpreadsheetStudentRow = {
  last_name: string;
  middle_name?: string | null;
  first_name: string;
  gender: string;
  birth_date?: string | null;
  student_matricule_number: string;
};

export type SpreadsheetExtractionResult = UnknownRecord & {
  rows?: SpreadsheetStudentRow[];
  headers?: string[];
};