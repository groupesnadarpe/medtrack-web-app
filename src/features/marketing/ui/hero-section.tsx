import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/core/routing/routes";

export function HeroSection() {
  return (
    <section id="presentation" className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col gap-6">
          <h1 className="max-w-xl font-display text-4xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl">
            La plateforme qui connecte étudiants, hôpitaux et universités pour des stages médicaux réussis
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-slate-300 text-pretty sm:text-base">
            Pilotez le cycle de formation de vos cliniciens de demain. MedTrack-RDC automatise, centralise et authentifie
            l&apos;attribution ainsi que l&apos;évaluation des stages cliniques sur l&apos;ensemble du territoire
            national.
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-4">
            <Link
              href={routes.login}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary-strong"
            >
              Accéder à mon espace
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a
              href="#fonctionnement"
              className="inline-flex h-12 items-center justify-center rounded-md border border-navy-foreground/40 px-6 text-sm font-semibold text-navy-foreground transition hover:bg-navy-soft"
            >
              Découvrir la plateforme
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image
            src="/assets/images/med-stage.png"
            alt="Trois étudiants en médecine en blouse blanche avec stéthoscope"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
