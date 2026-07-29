import Link from "next/link";
import { actorAreas } from "@/config/actors";
import { PublicShell } from "@/shared/components/layout/public-shell";

export default function HomePage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Medtrack</p>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight">
          Une seule plateforme pour piloter les stages médicaux, du dossier étudiant au reporting national.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Cette base Front-end sépare les pages publiques, les espaces protégés et les couches métier pour rester simple,
          testable et alignée avec nos microservices Laravel.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {actorAreas.map((actor) => (
            <Link key={actor.key} href={actor.path} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="font-semibold">{actor.label}</h2>
              <p className="mt-2 text-sm text-slate-300">{actor.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
