import type { EntityStatus, Uuid } from "@/shared/types/common";
import type { UnknownRecord } from "@/core/api/api-types";

export type Evaluation = UnknownRecord & {
  uuid?: Uuid;
  internship_uuid?: Uuid;
  evaluator_uuid?: Uuid;
  score?: number | null;
  status?: EntityStatus;
};

export type EvaluationTemplate = UnknownRecord & {
  uuid?: Uuid;
  name?: string;
  status?: EntityStatus;
};

export type AssessmentReport = UnknownRecord & {
  uuid?: Uuid;
  internship_uuid?: Uuid;
  status?: EntityStatus;
};

export type AcademicDecision = UnknownRecord & {
  uuid?: Uuid;
  internship_uuid?: Uuid;
  decision?: string;
  status?: EntityStatus;
};