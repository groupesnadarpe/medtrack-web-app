"use client";

import { HeartPulse, LogOut, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ActorArea } from "@/config/actors";
import { routes } from "@/core/routing/routes";
import type { AuthUser } from "@/features/auth/domain/auth-user";
import { DashboardNavigation } from "@/shared/components/layout/dashboard-navigation";
import { cn } from "@/shared/ui/utils";

type DashboardSidebarProps = {
  actor: ActorArea;
  user?: AuthUser | null;
  mobileOpen?: boolean;
  onClose?: () => void;
};

/** Sidebar institutionnelle commune à tous les espaces authentifiés. */
export function DashboardSidebar({ actor, user, mobileOpen = false, onClose }: DashboardSidebarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST", headers: { Accept: "application/json" } }).catch(() => null);
    router.replace(routes.login);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        aria-label="Fermer le menu de navigation"
        className={cn(
          "fixed inset-0 z-40 bg-navy/55 backdrop-blur-[2px] transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        aria-label={`Menu principal ${actor.label}`}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#1b2b4d] px-5 py-6 text-white shadow-2xl transition-transform duration-200 lg:translate-x-0 lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <Link href={actor.path} onClick={onClose} className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <HeartPulse className="size-5" strokeWidth={2.2} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-extrabold tracking-tight">MEDTRACK-RDC</span>
              <span className="block truncate text-[10px] font-bold tracking-[0.08em] text-primary uppercase">
                {actor.label}
              </span>
            </span>
          </Link>
          <button type="button" onClick={onClose} className="rounded-md p-1.5 text-[#bfccd9] hover:bg-white/10 hover:text-white lg:hidden" aria-label="Fermer la navigation">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-8 min-h-0 flex-1 overflow-y-auto pr-1">
          <DashboardNavigation actor={actor} user={user} onNavigate={onClose} />
        </div>

        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="mt-5 flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-wait disabled:opacity-60"
        >
          <LogOut className="size-5" strokeWidth={1.9} aria-hidden="true" />
          {loggingOut ? "Déconnexion..." : "Déconnexion"}
        </button>
      </aside>
    </>
  );
}