"use client";

import { Bell, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ActorArea } from "@/config/actors";
import { actorNavigation } from "@/config/navigation";
import type { AuthUser } from "@/features/auth/domain/auth-user";
import { useNotifications } from "@/features/notifications/application/use-notifications";

type DashboardHeaderProps = {
  actor: ActorArea;
  user?: AuthUser | null;
  onOpenMenu: () => void;
};

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Administrateur",
  MEDTRACK_ADMIN: "Administrateur Medtrack",
  UNIVERSITY_ADMIN: "Administrateur Université",
  UNIVERSITY_AGENT: "Agent universitaire",
  HOSPITAL_ADMIN: "Administrateur Hôpital",
  MEDICAL_ORDER_ADMIN: "Administrateur Ordre des médecins",
  MINISTRY_AGENT: "Agent du Ministère",
  STUDENT: "Étudiant",
};

function initialsFor(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "MT";
}

/** Header connecté commun, dérivé de la maquette Figma et alimenté par la session réelle. */
export function DashboardHeader({ actor, user, onOpenMenu }: DashboardHeaderProps) {
  const pathname = usePathname();
  const { unreadCount, isLoading, error } = useNotifications();
  const currentItem = actorNavigation[actor.key].find(
    (item) => pathname === item.href || (item.href !== actor.path && pathname.startsWith(`${item.href}/`)),
  );
  const displayName = user?.displayName || "Utilisateur Medtrack";
  const normalizedRole = user?.roles[0]?.trim().toUpperCase();
  const roleLabel = (normalizedRole && roleLabels[normalizedRole]) || actor.label;

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-[#e0e3e6] bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-5">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onOpenMenu} className="grid size-10 shrink-0 place-items-center rounded-lg border border-border text-navy hover:bg-muted lg:hidden" aria-label="Ouvrir la navigation">
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <h1 className="truncate text-lg font-extrabold text-[#1b2b4d] sm:text-xl">
            {currentItem?.label ?? "Tableau de bord"}
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <label className="hidden h-11 w-[min(34vw,440px)] items-center gap-3 rounded-lg border border-[#e0e3e6] bg-[#fbfcfd] px-4 text-muted-foreground md:flex">
            <Search className="size-5 shrink-0" strokeWidth={1.9} aria-hidden="true" />
            <span className="sr-only">Rechercher dans l’espace {actor.label}</span>
            <input type="search" placeholder="Rechercher..." className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
          </label>

          <button type="button" className="relative grid size-11 shrink-0 place-items-center rounded-lg border border-[#e0e3e6] bg-white text-muted-foreground transition hover:bg-muted hover:text-navy" aria-label={error ?? "Afficher les notifications"} title={error ?? "Notifications"}>
            <Bell className="size-5" strokeWidth={1.9} aria-hidden="true" />
            {!isLoading && unreadCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-extrabold leading-5 text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </button>

          <div className="hidden min-w-0 text-right sm:block">
            <strong className="block max-w-44 truncate text-sm font-bold text-[#1b2b4d]">{displayName}</strong>
            <span className="mt-0.5 block max-w-44 truncate text-xs text-muted-foreground">{roleLabel}</span>
          </div>
          <div className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-[#dbe2e8] bg-navy text-xs font-extrabold text-white" aria-label={`Profil de ${displayName}`}>
            {initialsFor(displayName)}
          </div>
        </div>
      </div>
    </header>
  );
}