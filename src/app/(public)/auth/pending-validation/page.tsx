import Link from "next/link";
import { AuthShell } from "@/shared/components/layout/auth-shell";

export default function PendingValidationPage() {
  return (
    <AuthShell
      title="Compte en validation"
      subtitle="Votre demande a été reçue. L’équipe Medtrack doit encore confirmer votre accès avant activation."
      footer={<Link href="/auth/login" className="text-sm font-bold text-[#08a99a]">Retour à la connexion</Link>}
    >
      <div className="rounded-xl bg-amber-50 p-4 text-amber-900">
        <p className="font-bold">Validation en cours</p>
        <p className="mt-2 text-sm leading-6">
          Vous serez notifié dès que votre compte sera validé. En cas d’urgence, contactez le support avec
          l’email professionnel utilisé lors de la demande.
        </p>
      </div>
    </AuthShell>
  );
}