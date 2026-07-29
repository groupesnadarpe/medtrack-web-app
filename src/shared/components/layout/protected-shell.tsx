import Link from "next/link";
import type { ActorArea } from "@/config/actors";
import { LogoutButton } from "@/features/auth/application/logout-button";
import type { AuthUser } from "@/features/auth/domain/auth-user";
import { NotificationBell } from "@/features/notifications/ui/notification-bell";
import { DashboardNavigation } from "@/shared/components/layout/dashboard-navigation";

export function ProtectedShell({
  actor,
  user,
  children,
}: Readonly<{
  actor: ActorArea;
  user?: AuthUser | null;
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r bg-white p-6 lg:block">
        <Link href={actor.path} className="text-xl font-semibold">
          Medtrack
        </Link>
        <p className="mt-2 text-sm text-slate-500">{actor.label}</p>
        <DashboardNavigation actor={actor} user={user} />
      </aside>
      <section className="lg:pl-72">
        <header className="border-b bg-white px-6 py-4">
          <p className="text-sm text-slate-500">Espace protégé</p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">{actor.label}</h1>
              {user ? <p className="text-sm text-slate-500">{user.displayName}</p> : null}
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <LogoutButton />
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </section>
    </main>
  );
}