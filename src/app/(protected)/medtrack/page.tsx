import { actorAreas } from "@/config/actors";
import { requireActorAccess } from "@/core/auth/guards";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "medtrack")!;

export default async function MedtrackAdminDashboardPage() {
  const { user } = await requireActorAccess("medtrack");

  return (
    <ProtectedShell actor={actor} user={user}>
      <p className="text-sm text-slate-500">ConnectÃ© : {user.displayName}</p>
      <p className="mt-4">Back-office Medtrack : comptes en attente, institutions, audit, support et administration globale.</p>
    </ProtectedShell>
  );
}