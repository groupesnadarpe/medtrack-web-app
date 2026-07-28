import Link from "next/link";
import { actorAreas } from "@/config/actors";
import { PublicShell } from "@/shared/components/layout/public-shell";

export default function HomePage() {
  return (
    <PublicShell>
      <section className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-teal-300">Point d'entrée commun</p>
          <h1 className="mt-7 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">Piloter les stages médicaux, simplement et en sécurité.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Medtrack-RDC réunit étudiants, universités, hôpitaux, Ordre des médecins, Ministère et équipe Medtrack sur une plateforme commune.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/auth/login" className="rounded-lg bg-[#08bfae] px-6 py-3 font-extrabold text-white shadow-xl shadow-teal-900/20 transition hover:bg-[#06ad9d]">Se connecter</Link>
            <Link href="/auth/register" className="rounded-lg border border-white/15 px-6 py-3 font-bold text-white transition hover:bg-white/10">Créer un compte</Link>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 text-slate-950 shadow-2xl shadow-slate-950/20">
          <h2 className="text-2xl font-black text-[#1d3156]">Espaces disponibles</h2>
          <p className="mt-2 text-sm text-slate-500">Découvrez les espaces adaptés à chaque acteur de la plateforme.</p>
          <div className="mt-5 grid gap-3">
            {actorAreas.map((actor) => (
              <div key={actor.key} className="rounded-xl border border-slate-100 p-4">
                <p className="font-black text-[#1d3156]">{actor.label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{actor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}