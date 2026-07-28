import { actorAreas } from "@/config/actors";
import { requireActorAccess } from "@/core/auth/guards";
import { DashboardHome } from "@/shared/components/layout/dashboard-home";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "student")!;

export default async function StudentDashboardPage() {
  const { user } = await requireActorAccess("student");

  return (
    <ProtectedShell actor={actor} user={user}>
      <DashboardHome
        actor={actor}
        user={user}
        title="Accueil étudiant"
        description="Point d'entrée personnel pour suivre les admissions, stages, rotations, présences, évaluations, paiements et notifications."
        actions={["Suivre mon stage", "Consulter mes présences", "Voir mes évaluations"]}
      />
    </ProtectedShell>
  );
}
