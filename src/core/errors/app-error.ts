export type AppErrorKind =
  | "validation"
  | "unauthenticated"
  | "forbidden"
  | "not-found"
  | "network"
  | "server"
  | "unknown";

export type FieldErrors = Record<string, string[]>;

export type AppErrorView = {
  kind: AppErrorKind;
  title: string;
  message: string;
  status?: number;
  code?: string;
  requestId?: string | null;
  fieldErrors: FieldErrors;
  shouldInviteLogin: boolean;
};