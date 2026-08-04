"use client";

import { useState } from "react";
import type { ActorArea } from "@/config/actors";
import type { AuthUser } from "@/features/auth/domain/auth-user";
import { DashboardHeader } from "@/shared/components/layout/dashboard-header";
import { DashboardSidebar } from "@/shared/components/layout/dashboard-sidebar";

/** Ossature responsive commune aux espaces protégés, sans remplacer les gardes serveur. */
export function ProtectedShell({
  actor,
  user,
  children,
}: Readonly<{
  actor: ActorArea;
  user?: AuthUser | null;
  children: React.ReactNode;
}>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-foreground">
      <DashboardSidebar actor={actor} user={user} mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="min-h-screen lg:pl-[260px]">
        <DashboardHeader actor={actor} user={user} onOpenMenu={() => setMobileMenuOpen(true)} />
        <main className="mx-auto w-full max-w-[1664px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}