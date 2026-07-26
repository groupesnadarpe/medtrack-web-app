import type { EntityStatus, IsoDateTimeString, Uuid } from "@/shared/types/common";
import type { UnknownRecord } from "@/core/api/api-types";

export type MoneyAmount = {
  amount: number;
  currency: string;
};

export type FinancialObligation = UnknownRecord & {
  uuid?: Uuid;
  student_uuid?: Uuid;
  total_amount?: number;
  currency?: string;
  status?: EntityStatus;
};

export type PaymentTransaction = UnknownRecord & {
  uuid?: Uuid;
  obligation_uuid?: Uuid;
  amount?: number;
  currency?: string;
  status?: EntityStatus;
  paid_at?: IsoDateTimeString | null;
};

export type RefundRequest = UnknownRecord & {
  uuid?: Uuid;
  transaction_uuid?: Uuid;
  status?: EntityStatus;
};

export type FinancialStatus = UnknownRecord & {
  student_uuid?: Uuid;
  is_clear?: boolean;
  balance?: number;
  currency?: string;
};