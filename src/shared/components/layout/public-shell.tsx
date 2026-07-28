import Link from "next/link";
import { routes } from "@/core/routing/routes";
import { MedtrackLogo } from "@/shared/components/brand/medtrack-logo";

export function PublicShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen bg-[#1d3156] text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href={routes.home} aria-label="Accueil Medtrack">
          <MedtrackLogo />
        </Link>
        <nav className="flex items-center gap-3">
          <Link href={routes.register} className="hidden rounded-2xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex">
            Demander un compte
          </Link>
          <Link href={routes.login} className="rounded-2xl bg-[#08bfae] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-900/20 transition hover:bg-[#06ad9d]">
            Se connecter
          </Link>
        </nav>
      </header>
      {children}
    </main>
  );
}