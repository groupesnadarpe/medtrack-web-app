import { AtSign, Globe, HeartPulse, MessageCircle } from "lucide-react";
import Link from "next/link";
import { routes } from "@/core/routing/routes";

const profileLinks = [
  { label: "Espace Étudiant", href: "/student" },
  { label: "Administration Hôpital", href: "/hospital" },
  { label: "Maître de Stage", href: "/hospital" },
  { label: "Espace Universitaire", href: "/university" },
];

const supportLinks = [
  { label: "Centre d'aide", href: "#" },
  { label: "Guides d'utilisation", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Mentions Légales", href: routes.legal },
];

const socials = [
  { label: "Fil d'actualité", icon: MessageCircle },
  { label: "Réseau professionnel", icon: AtSign },
  { label: "Site institutionnel", icon: Globe },
];

/** Pied de page institutionnel des pages publiques. */
export function SiteFooter() {
  return (
    <footer className="bg-navy-strong text-navy-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Link href={routes.home} className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              >
                <HeartPulse className="size-5" strokeWidth={2.25} />
              </span>
              <span className="font-display text-base font-extrabold tracking-tight">
                MEDTRACK<span className="text-primary">-RDC</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400 text-pretty">
              La plateforme gouvernementale de centralisation, d&apos;évaluation et de pilotage clinique des stages en
              santé publique en RDC.
            </p>
            <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
              Ministère de la Santé Publique RDC
            </p>
          </div>

          <FooterColumn title="Profil utilisateur" links={profileLinks} />
          <FooterColumn title="Communauté & support" links={supportLinks} />
        </div>
      </div>

      <div className="border-t border-navy-soft/60">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <p className="text-xs text-slate-400">
            Copyright © {new Date().getFullYear()} MEDTRACK-RDC • Tous droits réservés.
          </p>
          <ul className="flex items-center gap-4">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href="#"
                  className="flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-navy-soft hover:text-navy-foreground"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                  <span className="sr-only">{social.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title} className="flex flex-col gap-4">
      <h2 className="text-xs font-bold tracking-[0.14em] text-navy-foreground uppercase">{title}</h2>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-slate-400 transition hover:text-navy-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
