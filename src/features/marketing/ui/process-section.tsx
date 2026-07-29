import { ClipboardCheck, ShieldCheck, UserPlus } from "lucide-react";
import { SectionHeading } from "@/features/marketing/ui/section-heading";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Inscription & Vérification",
    description:
      "L'étudiant, l'hôpital ou l'université crée son compte sécurisé. Les profils sont immédiatement vérifiés auprès du Ministère pour garantir la validité des acquis académiques.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Matching & Attribution",
    description:
      "Grâce à notre algorithme intelligent, l'attribution des pools de stages se fait instantanément d'après les capacités de réception déclarées des hôpitaux et les maquettes pédagogiques.",
  },
  {
    number: "03",
    icon: ClipboardCheck,
    title: "Suivi & Évaluation",
    description:
      "Le suivi de la présence s'effectue quotidiennement sur le terrain. À la fin de chaque rotation, le maître de stage évalue l'étudiant en ligne, déclenchant la validation de ses crédits.",
  },
];

export function ProcessSection() {
  return (
    <section id="fonctionnement" className="bg-primary-soft/40">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeading
          eyebrow="Processus simplifié"
          title="Comment fonctionne MedTrack-RDC ?"
          description="Une approche unifiée et fluide pour encadrer chaque étape clé, de l'inscription au certificat final."
        />

        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary-strong"
                >
                  <step.icon className="size-5" strokeWidth={2.25} />
                </span>
                <span aria-hidden="true" className="font-display text-3xl font-extrabold text-primary/30">
                  {step.number}
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-navy">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
