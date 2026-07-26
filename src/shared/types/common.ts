export type Uuid = string;
export type IsoDateString = string;
export type IsoDateTimeString = string;

export type EntityStatus =
  | "draft"
  | "pending"
  | "active"
  | "inactive"
  | "approved"
  | "rejected"
  | "archived"
  | "cancelled"
  | string;

export type SelectOption<TValue extends string = string> = {
  label: string;
  value: TValue;
  disabled?: boolean;
};

export type PageMeta = {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
};