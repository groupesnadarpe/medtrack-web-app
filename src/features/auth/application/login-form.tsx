"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { actorAreas, type ActorArea } from "@/config/actors";

export function LoginForm() {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);

  // En mode maquette, aucun identifiant n'est transmis à une API.
  // Le formulaire ouvre seulement le sélecteur des espaces à prévisualiser.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setModalOpen(true);
  }

  function openActorArea(actor: ActorArea) {
    setModalOpen(false);
    router.push(actor.path);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Identifiant</span>
          <span className="mt-1.5 flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 shadow-sm focus-within:border-[#08bfae] focus-within:ring-4 focus-within:ring-teal-50">
            <span aria-hidden="true" className="w-5 text-center text-slate-400">✉</span>
            <input name="login" className="w-full bg-transparent text-[0.95rem] text-slate-900 outline-none placeholder:text-slate-400" placeholder="Email, téléphone ou matricule" autoComplete="username" />
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-700">Mot de passe</span>
          <span className="mt-1.5 flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 shadow-sm focus-within:border-[#08bfae] focus-within:ring-4 focus-within:ring-teal-50">
            <span aria-hidden="true" className="w-5 text-center text-slate-400">●</span>
            <input name="password" type="password" className="w-full bg-transparent text-[0.95rem] text-slate-900 outline-none placeholder:text-slate-400" placeholder="••••••••••••" autoComplete="current-password" />
          </span>
        </label>

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2.5 font-medium text-slate-500"><input name="remember" type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-[#08bfae]" />Se souvenir de moi</label>
          <Link href="/auth/forgot-password" className="font-bold text-[#08a99a] hover:text-[#08bfae]">Mot de passe oublié ?</Link>
        </div>

        <button type="submit" className="mt-1 h-12 w-full rounded-lg bg-[#08bfae] px-5 text-[0.95rem] font-extrabold text-white shadow-[0_10px_20px_rgba(8,191,174,0.2)] transition hover:bg-[#06ad9d]">Se connecter</button>
        <p className="text-center text-sm text-slate-500">Pas encore de compte ? <Link href="/auth/register" className="font-extrabold text-[#08a99a] hover:text-[#08bfae]">Créer un compte</Link></p>
      </form>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="workspace-title" onMouseDown={() => setModalOpen(false)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div><h2 id="workspace-title" className="text-xl font-black text-[#1d3156]">Choisir un espace</h2><p className="mt-1 text-sm text-slate-500">Sélectionnez l'acteur dont vous souhaitez prévisualiser les interfaces.</p></div>
              <button type="button" onClick={() => setModalOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xl text-slate-500 hover:bg-slate-200" aria-label="Fermer la fenêtre">×</button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {actorAreas.map((actor) => (
                <button key={actor.key} type="button" onClick={() => openActorArea(actor)} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#08bfae] hover:bg-teal-50">
                  <span className="block font-extrabold text-[#1d3156]">{actor.label}</span><span className="mt-1 block text-sm leading-5 text-slate-500">{actor.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}