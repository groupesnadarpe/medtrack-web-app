import Link from "next/link";
import { routes } from "@/core/routing/routes";

export function PublicShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href={routes.home} className="text-lg font-semibold">
          Medtrack
        </Link>
        <Link href={routes.login} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950">
          Se connecter
        </Link>
      </header>
      {children}
    </main>
  );
}
