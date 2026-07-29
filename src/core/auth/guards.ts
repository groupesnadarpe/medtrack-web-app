import { redirect } from "next/navigation";
import { actorAreas, type ActorKey } from "@/config/actors";
import { getCurrentSession } from "@/core/auth/auth-session";
import { canAccessActor } from "@/core/auth/role-access";
import { safeRedirectPath } from "@/core/auth/redirects";
import { routes } from "@/core/routing/routes";

export async function requireAuth(redirectTo?: string) {
  const session = await getCurrentSession();

  if (!session) {
    const loginPath = redirectTo
      ? `${routes.login}?redirect=${encodeURIComponent(safeRedirectPath(redirectTo))}`
      : routes.login;
    redirect(loginPath);
  }

  return session;
}

export async function requireActorAccess(actor: ActorKey) {
  const context = await requireAuth(actorAreas.find((area) => area.key === actor)?.path);

  if (canAccessActor(context.user.roles, actor)) {
    return context;
  }

  redirect(context.defaultPath ?? routes.login);
}
