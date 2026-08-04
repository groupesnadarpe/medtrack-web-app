import { actorAreas } from "@/config/actors";
import { requireActorAccess } from "@/core/auth/guards";
import { adminDashboardMock } from "@/features/medtrack-dashboard/data/dashboard.mock";
import { AdminDashboard } from "@/features/medtrack-dashboard/ui/admin-dashboard";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "medtrack")!;

export default async function MedtrackAdminDashboardPage() {
  // La garde serveur reste obligatoire, même lorsque les statistiques sont encore mockées.
  const { user } = await requireActorAccess("medtrack");

  return (
    <ProtectedShell actor={actor} user={user}>
      <AdminDashboard data={adminDashboardMock} user={user} />
    </ProtectedShell>
  );
}