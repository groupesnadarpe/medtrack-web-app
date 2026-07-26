import type { EntityStatus, IsoDateTimeString, Uuid } from "@/shared/types/common";

export type ActorSpace = "student" | "university" | "hospital" | "medical-order" | "ministry" | "medtrack";

export type AuthRoleAssignment = {
  uuid?: Uuid;
  role_code?: string;
  role?: { code?: string; name?: string };
  scope_type?: string | null;
  scope_uuid?: Uuid | null;
};

export type AuthUser = {
  uuid: Uuid;
  email?: string | null;
  phone?: string | null;
  display_name?: string | null;
  status?: EntityStatus;
  email_verified_at?: IsoDateTimeString | null;
  phone_verified_at?: IsoDateTimeString | null;
  role_assignments?: AuthRoleAssignment[];
  [key: string]: unknown;
};

export type UserSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: IsoDateTimeString;
  user?: AuthUser;
};

export type LoginCredentials = {
  login: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  user?: AuthUser;
};