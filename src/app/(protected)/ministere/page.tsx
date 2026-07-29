import { actorAreas } from "@/config/actors";
import { requireActorAccess } from "@/core/auth/guards";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "ministere")!;

export default async function MinistryDashboardPage() {
  const { user } = await requireActorAccess("ministere");

  return (
    <ProtectedShell actor={actor} user={user}>
      <p className="text-sm text-slate-500">ConnectÃ© : {user.displayName}</p>
      <p className="mt-4">Tableau de bord ministÃ¨re : indicateurs nationaux, rapports, suivi des institutions et pilotage.</p>
    </ProtectedShell>
  );
}