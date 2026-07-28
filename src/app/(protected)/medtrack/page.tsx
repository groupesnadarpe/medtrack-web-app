import { actorAreas } from "@/config/actors";
import { requireActorAccess } from "@/core/auth/guards";
import { DashboardHome } from "@/shared/components/layout/dashboard-home";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "medtrack")!;

export default async function MedtrackAdminDashboardPage() {
  const { user } = await requireActorAccess("medtrack");

  return (
    <ProtectedShell actor={actor} user={user}>
      <DashboardHome
        actor={actor}
        user={user}
        title="Accueil Admin Medtrack"
        description="Point d'entrée interne pour gérer les validations de comptes, institutions, audits, support et administration globale."
        actions={["Valider les comptes", "Administrer les institutions", "Suivre le support"]}
      />
    </ProtectedShell>
  );
}
