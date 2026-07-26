import { actorAreas } from "@/config/actors";
import { requireActorAccess } from "@/core/auth/guards";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "student")!;

export default async function StudentDashboardPage() {
  const { user } = await requireActorAccess("student");

  return (
    <ProtectedShell actor={actor} user={user}>
      <p className="text-sm text-slate-500">ConnectÃ© : {user.displayName}</p>
      <p className="mt-4">Tableau de bord Ã©tudiant : stage, rotations, prÃ©sences, Ã©valuations et notifications.</p>
    </ProtectedShell>
  );
}