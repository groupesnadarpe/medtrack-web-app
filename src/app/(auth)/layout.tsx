import Link from "next/link";
import { routes } from "@/core/routing/routes";
import { AuthHeroPanel } from "@/features/auth/ui/auth-hero-panel";

/**
 * Gabarit commun aux écrans d'authentification (`/login`, `/register`, ...).
 * Le segment `(auth)` est un groupe de routes : il n'apparaît pas dans l'URL.
 */
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <AuthHeroPanel />

      <section className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="mx-auto flex w-full max-w-lg flex-col">
          {children}

          <div className="mt-12 border-t border-border pt-6">
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>Copyright © {new Date().getFullYear()} MEDTRACK-RDC.</span>
              <span aria-hidden="true">•</span>
              <Link href={routes.legal} className="font-semibold text-primary-strong transition hover:underline">
                Mentions légales
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
