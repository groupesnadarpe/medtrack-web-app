import { actorAreas } from "@/config/actors";
import { requireActorAccess } from "@/core/auth/guards";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "ordre-de-medecin")!;

export default async function MedicalOrderDashboardPage() {
  const { user } = await requireActorAccess("ordre-de-medecin");

  return (
    <ProtectedShell actor={actor} user={user}>
      <p className="text-sm text-slate-500">ConnectÃ© : {user.displayName}</p>
      <p className="mt-4">Tableau de bord Ordre des mÃ©decins : supervision, conformitÃ©, validations et rapports professionnels.</p>
    </ProtectedShell>
  );
}