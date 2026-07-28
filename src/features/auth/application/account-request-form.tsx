"use client";

import { FormEvent, useState } from "react";

type RequestState = {
  submitted: boolean;
};

const fieldClass = "mt-2 h-[50px] w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-950 outline-none transition focus:border-[#08bfae] focus:ring-4 focus:ring-teal-50";

export function AccountRequestForm() {
  const [state, setState] = useState<RequestState>({ submitted: false });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Cette UI prépare le workflow ; le branchement API sera fait quand le payload institutionnel final sera figé.
    setState({ submitted: true });
  }

  if (state.submitted) {
    return (
      <div className="rounded-xl bg-teal-50 p-4 text-teal-800">
        <p className="font-bold">Demande préparée.</p>
        <p className="mt-2 text-sm">Le branchement API permettra ensuite d’envoyer cette demande à Medtrack pour validation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <label className="block">
        <span className="text-sm font-bold text-slate-700">Type d’établissement</span>
        <select name="institution_type" required className={fieldClass}>
          <option value="">Sélectionner</option>
          <option value="UNIVERSITY">Université</option>
          <option value="HOSPITAL">Hôpital</option>
          <option value="MEDICAL_ORDER">Ordre des médecins</option>
          <option value="MINISTRY">Ministère</option>
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-bold text-slate-700">Nom de l’établissement</span>
        <input name="institution_name" required className={fieldClass} />
      </label>
      <label className="block">
        <span className="text-sm font-bold text-slate-700">Email professionnel</span>
        <input name="email" type="email" required className={fieldClass} />
      </label>
      <button type="submit" className="mt-2 h-[52px] w-full rounded-2xl bg-[#08bfae] px-5 text-base font-extrabold text-white shadow-[0_12px_24px_rgba(8,191,174,0.22)] transition hover:-translate-y-0.5 hover:bg-[#06ad9d]">
        Soumettre la demande
      </button>
    </form>
  );
}