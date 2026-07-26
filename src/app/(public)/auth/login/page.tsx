import { Suspense } from "react";
import { LoginForm } from "@/features/auth/application/login-form";
import { PublicShell } from "@/shared/components/layout/public-shell";

export default function LoginPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-md px-6 py-20">
        <h1 className="text-3xl font-semibold">Connexion</h1>
        <p className="mt-3 text-slate-300">Connecte-toi avec ton matricule, ton email vérifié ou ton numéro vérifié.</p>
        <Suspense fallback={<p className="mt-8 text-sm text-slate-300">Chargement du formulaire...</p>}>
          <LoginForm />
        </Suspense>
      </section>
    </PublicShell>
  );
}