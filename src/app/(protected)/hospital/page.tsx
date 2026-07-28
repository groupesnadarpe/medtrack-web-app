import { actorAreas } from "@/config/actors";
import { requireActorAccess } from "@/core/auth/guards";
import { DashboardHome } from "@/shared/components/layout/dashboard-home";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "hospital")!;

export default async function HospitalDashboardPage() {
  const { user } = await requireActorAccess("hospital");

  return (
    <ProtectedShell actor={actor} user={user}>
      <DashboardHome
        actor={actor}
        user={user}
        title="Accueil hôpital"
        description="Point d'entrée des équipes hospitalières pour suivre les admissions, rotations, encadreurs, présences et validations."
        actions={["Consulter les admissions", "Planifier les rotations", "Valider les présences"]}
      />
    </ProtectedShell>
  );
}
