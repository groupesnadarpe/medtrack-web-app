import { PublicShell } from "@/shared/components/layout/public-shell";

export default function RegisterPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-md px-6 py-20">
        <h1 className="text-3xl font-semibold">Demande de compte</h1>
        <p className="mt-3 text-slate-300">
          Cette page servira aux demandes de comptes institutionnels en attente de validation Medtrack.
        </p>
      </section>
    </PublicShell>
  );
}
