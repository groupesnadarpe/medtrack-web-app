import Link from "next/link";
import { SimpleAuthForm } from "@/features/auth/application/simple-auth-form";
import { AuthShell } from "@/shared/components/layout/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Mot de passe oublié"
      subtitle="Indiquez votre email, téléphone ou matricule afin de recevoir les instructions de réinitialisation."
      footer={<Link href="/auth/login" className="text-sm font-bold text-teal-600">Retour à la connexion</Link>}
    >
      <SimpleAuthForm submitLabel="Envoyer les instructions" successMessage="Si le compte existe, des instructions seront envoyées au contact vérifié.">
        <label className="block">
          <span className="text-sm font-bold text-slate-700">Email, téléphone ou matricule</span>
          <input name="login" required className="mt-2 h-[50px] w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-950 outline-none transition focus:border-[#08bfae] focus:ring-4 focus:ring-teal-50" />
        </label>
      </SimpleAuthForm>
    </AuthShell>
  );
}