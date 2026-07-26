import Link from "next/link";
import type { ActorArea } from "@/config/actors";
import { actorNavigation } from "@/config/navigation";
import { canUseActorPermission } from "@/core/permissions/ui-permissions";
import type { AuthUser } from "@/features/auth/domain/auth-user";

type DashboardNavigationProps = {
  actor: ActorArea;
  user?: AuthUser | null;
};

export function DashboardNavigation({ actor, user }: DashboardNavigationProps) {
  const items = actorNavigation[actor.key].filter((item) => {
    if (!item.permission) return true;
    return canUseActorPermission(user, actor.key, item.permission).allowed;
  });

  return (
    <nav className="mt-8 space-y-1" aria-label={`Navigation ${actor.label}`}>
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}