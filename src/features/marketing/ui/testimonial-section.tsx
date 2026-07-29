import { Quote } from "lucide-react";
import Image from "next/image";

export function TestimonialSection() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <figure className="grid items-center gap-10 rounded-2xl bg-navy px-8 py-12 text-navy-foreground lg:grid-cols-[1.6fr_1fr] lg:px-14">
          <div className="flex flex-col gap-6">
            <Quote className="size-8 text-primary" aria-hidden="true" />
            <blockquote className="text-base leading-relaxed text-pretty sm:text-lg">
              &ldquo;MedTrack-RDC a profondément modernisé le suivi de nos étudiants. Fini les livrets de stages égarés
              et les retards de validation. En connectant numériquement la Faculté de Médecine de Kinshasa aux
              différents hôpitaux cliniques, nous garantissons l&apos;intégrité de la formation de nos futurs
              médecins.&rdquo;
            </blockquote>
            <figcaption className="flex flex-col gap-1">
              <span className="font-display text-sm font-bold text-primary">Prof. Robert Kalala M.</span>
              <span className="text-xs text-slate-400">
                Doyen de la Faculté de Médecine de Kinshasa • Coordinateur National de Formation
              </span>
            </figcaption>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border-4 border-navy-foreground/90">
            <Image
              src="/images/home/testimonial-dean.png"
              alt="Portrait du Professeur Robert Kalala M., doyen de la Faculté de Médecine de Kinshasa"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
