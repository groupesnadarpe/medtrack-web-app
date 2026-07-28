"use client";

import { FormEvent, ReactNode, useState } from "react";

type SimpleAuthFormProps = {
  submitLabel: string;
  successMessage: string;
  children: ReactNode;
};

export function SimpleAuthForm({ submitLabel, successMessage, children }: SimpleAuthFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Formulaire UI prêt : l’appel API sera branché dans la phase d’intégration fonctionnelle de chaque écran.
    setSubmitted(true);
  }

  if (submitted) {
    return <p className="rounded-xl bg-teal-50 p-4 text-sm font-semibold text-teal-800">{successMessage}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {children}
      <button type="submit" className="mt-2 h-[52px] w-full rounded-2xl bg-[#08bfae] px-5 text-base font-extrabold text-white shadow-[0_12px_24px_rgba(8,191,174,0.22)] transition hover:-translate-y-0.5 hover:bg-[#06ad9d]">
        {submitLabel}
      </button>
    </form>
  );
}