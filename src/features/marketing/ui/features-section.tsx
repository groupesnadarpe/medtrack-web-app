import { Award, Bell, CalendarClock, Repeat, Star, TrendingUp } from "lucide-react";
import { SectionHeading } from "@/features/marketing/ui/section-heading";

const features = [
  {
    icon: Repeat,
    title: "Gestion des rotations",
    description: "Planifiez et visualisez l'enchaînement de vos cycles cliniques en quelques clics.",
  },
  {
    icon: Star,
    title: "Évaluations 360°",
    description: "Notation complète intégrée d'après le référentiel de compétences du Ministère.",
  },
  {
    icon: CalendarClock,
    title: "Planning intelligent",
    description: "Évitez les surcharges de stagiaires dans vos services hospitaliers grâce aux quotas dynamiques.",
  },
  {
    icon: TrendingUp,
    title: "Rapports & Analytics",
    description: "Générez des rapports synthétiques sur l'assiduité, les notes moyennes et l'activité nationale.",
  },
  {
    icon: Bell,
    title: "Notifications temps réel",
    description: "Restez alertés des validations, absences ou débuts de nouveaux cycles.",
  },
  {
    icon: Award,
    title: "Certificats numériques",
    description: "Générez des certificats d'achèvement de stage signés électroniquement.",
  },
];

export function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="bg-primary-soft/40">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading
          eyebrow="Puissance technique"
          title="Des fonctionnalités pensées pour la santé publique"
          description="Un socle moderne et résistant, conçu spécifiquement pour répondre aux enjeux de la formation clinique."
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.title} className="flex gap-4 rounded-xl border border-border bg-card p-6">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-strong"
              >
                <feature.icon className="size-5" strokeWidth={2.25} />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-sm font-bold text-navy">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
