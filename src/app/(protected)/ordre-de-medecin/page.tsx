import { actorAreas } from "@/config/actors";
import { requireActorAccess } from "@/core/auth/guards";
import { DashboardHome } from "@/shared/components/layout/dashboard-home";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "ordre-de-medecin")!;

export default async function MedicalOrderDashboardPage() {
  const { user } = await requireActorAccess("ordre-de-medecin");

  return (
    <ProtectedShell actor={actor} user={user}>
      <DashboardHome
        actor={actor}
        user={user}
        title="Accueil Ordre des médecins"
        description="Point d'entrée pour la supervision professionnelle, la conformité, les validations et les rapports institutionnels."
        actions={["Superviser les institutions", "Consulter les rapports", "Suivre la conformité"]}
      />
    </ProtectedShell>
  );
}
