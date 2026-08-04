"use client";

import {
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  CheckSquare2,
  GraduationCap,
  Headphones,
  ImageIcon,
  LayoutDashboard,
  LucideIcon,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ActorArea } from "@/config/actors";
import { actorNavigation, type NavigationItem } from "@/config/navigation";
import { canUseActorPermission } from "@/core/permissions/ui-permissions";
import type { AuthUser } from "@/features/auth/domain/auth-user";
import { cn } from "@/shared/ui/utils";

type DashboardNavigationProps = {
  actor: ActorArea;
  user?: AuthUser | null;
  onNavigate?: () => void;
};

/** Associe les domaines fonctionnels à une icône stable, sans stocker de composants dans la configuration. */
function iconFor(item: NavigationItem): LucideIcon {
  const path = item.href;

  if (path.endsWith("/students") || path.endsWith("/users") || path.endsWith("/team")) return Users;
  if (path.includes("academic")) return GraduationCap;
  if (path.includes("admission") || path.includes("validation")) return UserPlus;
  if (path.includes("internship")) return BookOpen;
  if (path.includes("scheduling")) return CalendarDays;
  if (path.includes("attendance")) return CheckSquare2;
  if (path.includes("assessment")) return Stethoscope;
  if (path.includes("payment") || path.includes("finance")) return Wallet;
  if (path.includes("media")) return ImageIcon;
  if (path.includes("institution")) return Building2;
  if (path.includes("support")) return Headphones;
  if (path.includes("report")) return BarChart3;
  if (path.includes("setting")) return Settings;
  if (path.includes("permission")) return ShieldCheck;

  return LayoutDashboard;
}

export function DashboardNavigation({ actor, user, onNavigate }: DashboardNavigationProps) {
  const pathname = usePathname();
  const items = actorNavigation[actor.key].filter((item) => {
    if (!item.permission) return true;
    return canUseActorPermission(user, actor.key, item.permission).allowed;
  });

  return (
    <nav className="flex flex-col gap-1" aria-label={`Navigation ${actor.label}`}>
      {items.map((item) => {
        const Icon = iconFor(item);
        const active = pathname === item.href || (item.href !== actor.path && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
              active
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "text-[#bfccd9] hover:bg-white/8 hover:text-white",
            )}
          >
            <Icon className="size-5 shrink-0" strokeWidth={1.9} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}