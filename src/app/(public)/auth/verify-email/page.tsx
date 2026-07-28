import { SimpleAuthForm } from "@/features/auth/application/simple-auth-form";
import { AuthShell } from "@/shared/components/layout/auth-shell";

export default function VerifyEmailPage() {
  return (
    <AuthShell title="Vérification email" subtitle="Saisissez le code reçu sur votre adresse professionnelle vérifiée.">
      <SimpleAuthForm submitLabel="Vérifier l’adresse email" successMessage="Le code email est prêt à être validé par l’API.">
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Code de vérification</span>
          <input name="code" required className="mt-2 h-[50px] w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-950 outline-none transition focus:border-[#08bfae] focus:ring-4 focus:ring-teal-50" />
        </label>
      </SimpleAuthForm>
    </AuthShell>
  );
}