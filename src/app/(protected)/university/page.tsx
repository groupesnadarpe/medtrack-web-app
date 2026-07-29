import { actorAreas } from "@/config/actors";
import { requireActorAccess } from "@/core/auth/guards";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "university")!;

export default async function UniversityDashboardPage() {
  const { user } = await requireActorAccess("university");

  return (
    <ProtectedShell actor={actor} user={user}>
      <p className="text-sm text-slate-500">ConnectÃ© : {user.displayName}</p>
      <p className="mt-4">Tableau de bord universitÃ© : Ã©tudiants, imports Excel, facultÃ©s, dÃ©partements, promotions et campagnes.</p>
    </ProtectedShell>
  );
}