import Image from "next/image";
import { SectionHeading } from "@/features/marketing/ui/section-heading";

const actors = [
  {
    title: "Étudiants en médecine",
    description: "Ils se préparent au terrain clinique, suivent leurs rotations et centralisent leurs évaluations et validations.",
    image: "/images/home/actor-students.png",
    alt: "Étudiante en médecine souriante tenant une tablette dans un couloir d'hôpital",
  },
  {
    title: "Hôpitaux & Cliniques",
    description: "Ils accueillent, organisent les rotations et gèrent les arrivées, les plannings et les présences des stagiaires.",
    image: "/images/home/actor-hospitals.png",
    alt: "Bâtiment hospitalier moderne en verre avec bassin d'eau",
  },
  {
    title: "Maîtres de Stage",
    description: "Ils encadrent, évaluent et valident les compétences pratiques, et assurent un suivi quotidien sur le terrain.",
    image: "/images/home/actor-supervisors.png",
    alt: "Médecin senior en blouse blanche dans un service hospitalier",
  },
  {
    title: "Universités & Facultés",
    description: "Elles pilotent les cohortes, gèrent les conventions et suivent les résultats, pour garantir une formation cohérente et réglementaire.",
    image: "/images/home/actor-universities.png",
    alt: "Campus universitaire de médecine avec bâtiment vitré et jardins",
  },
];

export function ActorsSection() {
  return (
    <section id="portails" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading
          eyebrow="Acteurs de la formation"
          title="Tous les acteurs de la formation médicale, connectés sur une seule plateforme"
          description="MedTrack crée un pont entre les différents acteurs du parcours clinique : étudiants, hôpitaux, maîtres de stage et universités, pour fluidifier l'organisation, la supervision et l'évaluation."
        />

        <ul className="mt-12 grid gap-6 lg:grid-cols-2">
          {actors.map((actor) => (
            <li key={actor.title} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
              <div className="relative aspect-[16/8] w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={actor.image}
                  alt={actor.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 px-2 pb-2">
                <h3 className="font-display text-base font-bold text-navy">{actor.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{actor.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
