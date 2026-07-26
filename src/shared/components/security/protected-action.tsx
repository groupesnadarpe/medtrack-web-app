import type { ComponentPropsWithoutRef } from "react";
import type { ActorKey } from "@/config/actors";
import { canUseActorPermission, explainDisabledAction, type UiPermission } from "@/core/permissions/ui-permissions";
import type { AuthUser } from "@/features/auth/domain/auth-user";
import { Button } from "@/shared/ui/button";

type ProtectedActionProps = ComponentPropsWithoutRef<typeof Button> & {
  user?: AuthUser | null;
  actor: ActorKey;
  permission: UiPermission;
};

export function ProtectedAction({ user, actor, permission, disabled, title, children, ...props }: ProtectedActionProps) {
  const state = canUseActorPermission(user, actor, permission);

  return (
    <Button {...props} disabled={disabled || !state.allowed} title={title ?? explainDisabledAction(state)}>
      {children}
    </Button>
  );
}