import { SimpleAuthForm } from "@/features/auth/application/simple-auth-form";
import { AuthShell } from "@/shared/components/layout/auth-shell";

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Nouveau mot de passe" subtitle="Choisissez un mot de passe robuste pour sécuriser votre accès Medtrack.">
      <SimpleAuthForm submitLabel="Réinitialiser le mot de passe" successMessage="Votre demande de réinitialisation est prête à être transmise à l’API.">
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Code de réinitialisation</span>
          <input name="token" required className="mt-2 h-[50px] w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-950 outline-none transition focus:border-[#08bfae] focus:ring-4 focus:ring-teal-50" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Nouveau mot de passe</span>
          <input name="password" type="password" required className="mt-2 h-[50px] w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-950 outline-none transition focus:border-[#08bfae] focus:ring-4 focus:ring-teal-50" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Confirmer le mot de passe</span>
          <input name="password_confirmation" type="password" required className="mt-2 h-[50px] w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-950 outline-none transition focus:border-[#08bfae] focus:ring-4 focus:ring-teal-50" />
        </label>
      </SimpleAuthForm>
    </AuthShell>
  );
}