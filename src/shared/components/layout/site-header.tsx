import { HeartPulse } from "lucide-react";
import Link from "next/link";
import { routes } from "@/core/routing/routes";

const navigation = [
  { label: "Présentation", href: "#presentation" },
  { label: "Chiffres", href: "#chiffres" },
  { label: "Fonctionnement", href: "#fonctionnement" },
  { label: "Portails", href: "#portails" },
  { label: "Fonctionnalités", href: "#fonctionnalites" },
];

/** Barre de navigation des pages publiques (landing, contenus institutionnels). */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <Link href={routes.home} className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
            <HeartPulse className="size-5" strokeWidth={2.25} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-extrabold tracking-tight text-navy">
              MEDTRACK<span className="text-primary">-RDC</span>
            </span>
            <span className="text-[0.5rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Ministère de la Santé Publique
            </span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-navy"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={routes.login}
            className="inline-flex h-9 items-center justify-center rounded-md border border-primary px-4 text-sm font-semibold text-primary-strong transition hover:bg-primary-soft"
          >
            Se connecter
          </Link>
          <Link
            href={routes.register}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary-strong"
          >
            Créer un espace
          </Link>
        </div>
      </div>
    </header>
  );
}
