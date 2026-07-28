import type { ActorArea } from "@/config/actors";
import type { AuthUser } from "@/features/auth/domain/auth-user";

type DashboardHomeProps = {
  actor: ActorArea;
  user: AuthUser;
  title: string;
  description: string;
  actions: string[];
};

// Page d'accueil minimale commune aux espaces protégés.
// Elle sert de socle temporaire avant la création des vrais dashboards métier.
export function DashboardHome({ actor, user, title, description, actions }: DashboardHomeProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">{actor.label}</p>
        <h2 className="mt-3 text-2xl font-black text-[#1d3156]">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
        <p className="mt-5 text-sm text-slate-500">
          Connecté : <span className="font-bold text-slate-700">{user.displayName}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <article key={action} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-[#1d3156]">{action}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Module préparé pour les prochaines interfaces métier.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
