import type { ActorKey } from "@/config/actors";

export type AuthUser = {
  uuid: string;
  displayName: string;
  email?: string | null;
  phone?: string | null;
  roles: string[];
  actorAreas: ActorKey[];
};

export type LoginCredentials = {
  login: string;
  password: string;
};

export type LoginResult = {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
};