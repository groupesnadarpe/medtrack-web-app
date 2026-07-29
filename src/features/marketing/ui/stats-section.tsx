import { Briefcase, GraduationCap, Star, Users } from "lucide-react";

const stats = [
  { value: "2,400+", label: "Étudiants actifs", icon: Users },
  { value: "85", label: "Hôpitaux partenaires", icon: Briefcase },
  { value: "12", label: "Universités connectées", icon: GraduationCap },
  { value: "96%", label: "Taux de satisfaction", icon: Star },
];

export function StatsSection() {
  return (
    <section id="chiffres" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="sr-only">MedTrack-RDC en chiffres</h2>
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-5"
            >
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-strong"
              >
                <stat.icon className="size-5" strokeWidth={2.25} />
              </span>
              <div className="flex flex-col">
                <dt className="order-2 text-xs text-muted-foreground">{stat.label}</dt>
                <dd className="order-1 font-display text-2xl font-extrabold text-navy">{stat.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
