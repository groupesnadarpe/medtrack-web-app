import { actorAreas } from "@/config/actors";
import { requireActorAccess } from "@/core/auth/guards";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "hospital")!;

export default async function HospitalDashboardPage() {
  const { user } = await requireActorAccess("hospital");

  return (
    <ProtectedShell actor={actor} user={user}>
      <p className="text-sm text-slate-500">ConnectÃ© : {user.displayName}</p>
      <p className="mt-4">Tableau de bord hÃ´pital : admissions, rotations, encadreurs, prÃ©sences et validations.</p>
    </ProtectedShell>
  );
}