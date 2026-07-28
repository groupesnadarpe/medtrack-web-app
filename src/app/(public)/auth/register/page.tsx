import Link from "next/link";
import { AccountRequestForm } from "@/features/auth/application/account-request-form";
import { AuthShell } from "@/shared/components/layout/auth-shell";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Demande de compte"
      subtitle="Soumettez votre espace institutionnel à l’équipe Medtrack pour validation."
      footer={<p className="text-sm text-slate-500">Déjà validé ? <Link href="/auth/login" className="font-bold text-teal-600">Se connecter</Link></p>}
    >
      <AccountRequestForm />
    </AuthShell>
  );
}