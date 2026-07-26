import type { ActorKey } from "@/config/actors";
import { canUseActorPermission, type UiPermission } from "@/core/permissions/ui-permissions";
import type { AuthUser } from "@/features/auth/domain/auth-user";

type PermissionGateProps = Readonly<{
  user?: AuthUser | null;
  actor: ActorKey;
  permission: UiPermission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}>;

export function PermissionGate({ user, actor, permission, fallback = null, children }: PermissionGateProps) {
  const state = canUseActorPermission(user, actor, permission);

  return state.allowed ? <>{children}</> : <>{fallback}</>;
}