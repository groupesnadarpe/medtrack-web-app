import { actorAreas } from "@/config/actors";
import { requireActorAccess } from "@/core/auth/guards";
import { DashboardHome } from "@/shared/components/layout/dashboard-home";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "university")!;

export default async function UniversityDashboardPage() {
  const { user } = await requireActorAccess("university");

  return (
    <ProtectedShell actor={actor} user={user}>
      <DashboardHome
        actor={actor}
        user={user}
        title="Accueil université"
        description="Point d'entrée des équipes universitaires pour gérer les étudiants, imports Excel, facultés, départements, promotions et campagnes de stage."
        actions={["Gérer les étudiants", "Importer un fichier Excel", "Suivre les campagnes"]}
      />
    </ProtectedShell>
  );
}
