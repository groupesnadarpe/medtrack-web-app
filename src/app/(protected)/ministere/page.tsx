import { actorAreas } from "@/config/actors";
import { requireActorAccess } from "@/core/auth/guards";
import { DashboardHome } from "@/shared/components/layout/dashboard-home";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "ministere")!;

export default async function MinistryDashboardPage() {
  const { user } = await requireActorAccess("ministere");

  return (
    <ProtectedShell actor={actor} user={user}>
      <DashboardHome
        actor={actor}
        user={user}
        title="Accueil ministère"
        description="Point d'entrée institutionnel pour consulter les indicateurs nationaux, rapports, institutions et données de pilotage."
        actions={["Voir les indicateurs", "Consulter les institutions", "Ouvrir les rapports"]}
      />
    </ProtectedShell>
  );
}
