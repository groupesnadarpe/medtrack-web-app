import { ShieldCheck } from "lucide-react";
import { BrandMark } from "@/shared/components/branding/brand-mark";

/** Panneau de marque affiché à gauche des écrans d'authentification. */
export function AuthHeroPanel() {
  return (
    <aside className="relative flex flex-col justify-between overflow-hidden bg-navy px-8 py-10 text-navy-foreground lg:px-14 lg:py-14">
      {/* Décor : formes translucides reprenant l'identité visuelle du panneau. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden max-lg:hidden remonte">
        <span className="absolute bottom-32 left-4 size-64 rounded-full bg-navy-soft/50" />
        <span className="absolute bottom-48 left-44 size-32 rounded-full bg-navy-soft/35" />
        <span className="absolute bottom-24 left-60 size-40 rounded-full bg-navy-soft/45" />
        <span className="absolute bottom-14 left-2 size-32 rounded-[1.75rem] bg-navy-soft/45" />
        <span className="absolute bottom-20 left-36 size-24 rounded-[1.5rem] bg-navy-soft/30" />
        <span className="absolute bottom-28 left-72 size-3 rounded-full bg-navy-soft/70" />
        <span className="absolute bottom-16 left-80 size-5 rounded-full bg-navy-soft/50" />
      </div>

      <div className="relative flex flex-col gap-10">
        <BrandMark tagline="Plateforme nationale" tone="light" />

        <div className="flex flex-col gap-6">
          <h1 className="max-w-xl font-display text-3xl font-extrabold leading-tight text-balance lg:text-4xl">
            Plateforme de gestion des stages médicaux
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-slate-300 text-pretty">
            Supervisez, validez et optimisez le parcours clinique des futurs professionnels de santé de la République
            Démocratique du Congo.
          </p>
        </div>
      </div>

      <p className="relative mt-12 flex items-center gap-2 text-sm text-slate-400">
        <ShieldCheck className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
        <span>Portail hautement sécurisé • Ministère de la Santé Publique RDC</span>
      </p>
    </aside>
  );
}
