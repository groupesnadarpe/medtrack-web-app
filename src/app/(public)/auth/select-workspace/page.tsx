import Link from "next/link";
import { redirect } from "next/navigation";
import { actorAreas } from "@/config/actors";
import { getCurrentSession } from "@/core/auth/auth-session";
import { AuthShell } from "@/shared/components/layout/auth-shell";

export default async function SelectWorkspacePage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth/login");
  }

  const allowedActors = actorAreas.filter((actor) => session.user.actorAreas.includes(actor.key));

  return (
    <AuthShell title="Choisir un espace" subtitle="Votre compte peut accéder à plusieurs espaces. Sélectionnez celui que vous voulez ouvrir.">
      <div className="grid gap-3">
        {allowedActors.map((actor) => (
          <Link key={actor.key} href={actor.path} className="rounded-2xl border border-slate-100 p-4 transition hover:border-teal-200 hover:bg-teal-50">
            <p className="font-black text-[#1d3156]">{actor.label}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">{actor.description}</p>
          </Link>
        ))}
      </div>
    </AuthShell>
  );
}