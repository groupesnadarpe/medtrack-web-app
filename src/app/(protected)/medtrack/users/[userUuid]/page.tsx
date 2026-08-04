import { actorAreas } from "@/config/actors";
import { ApiError } from "@/core/api/api-error";
import { requireActorAccess } from "@/core/auth/guards";
import type { InstitutionUnitOption, OptionalServiceState, UserDetailData, UserDetailFailure, UserProfileDetail } from "@/features/medtrack-users/domain/user-detail";
import { listInstitutionOptions } from "@/features/medtrack-users/infrastructure/user-management-api";
import { getManagedUser, getManagedUserAuthorization, getManagedUserProfile, listInstitutionUnits, listUserInternships } from "@/features/medtrack-users/infrastructure/user-detail-api";
import { UserDetail, UserDetailError } from "@/features/medtrack-users/ui/user-detail";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "medtrack")!;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type PageProps = Readonly<{ params: Promise<{ userUuid: string }> }>;

function failureFrom(error: unknown): UserDetailFailure {
  if (error instanceof ApiError) return {
    kind: error.status === 404 ? "not-found" : error.status === 403 ? "forbidden" : "unavailable",
    message: error.message,
    requestId: error.problem?.request_id,
  };
  return { kind: "unavailable", message: "Impossible de joindre le service d’identité." };
}

function warningFrom(service: OptionalServiceState["service"], error: unknown): OptionalServiceState {
  const label = { profile: "Profil", authorizations: "Autorisations", institutions: "Institutions", internships: "Stages" }[service];
  return { service, message: `${label} indisponible.`, requestId: error instanceof ApiError ? error.problem?.request_id : null };
}

/** Agrège les domaines sans faire échouer toute la fiche lorsqu’un service secondaire est arrêté. */
export default async function MedtrackUserDetailPage({ params }: PageProps) {
  const { user: currentUser, auth } = await requireActorAccess("medtrack");
  const { userUuid } = await params;
  let failure: UserDetailFailure | null = null;
  let detail: UserDetailData | null = null;

  if (!uuidPattern.test(userUuid)) {
    failure = { kind: "not-found", message: "L’identifiant utilisateur fourni est invalide." };
  } else {
    try {
      const userResponse = await getManagedUser(userUuid, auth.accessToken);
      const [profileResult, authorizationResult, internshipsResult, institutionsResult] = await Promise.allSettled([
        getManagedUserProfile(userUuid, auth.accessToken),
        getManagedUserAuthorization(userUuid, auth.accessToken),
        listUserInternships(userUuid, auth.accessToken),
        listInstitutionOptions(auth.accessToken),
      ]);
      const warnings: OptionalServiceState[] = [];
      if (profileResult.status === "rejected") warnings.push(warningFrom("profile", profileResult.reason));
      if (authorizationResult.status === "rejected") warnings.push(warningFrom("authorizations", authorizationResult.reason));
      if (internshipsResult.status === "rejected") warnings.push(warningFrom("internships", internshipsResult.reason));
      if (institutionsResult.status === "rejected") warnings.push(warningFrom("institutions", institutionsResult.reason));

      const profile = profileResult.status === "fulfilled" ? profileResult.value.data : (userResponse.data.profile as UserProfileDetail | null | undefined) ?? null;
      const institutionUuid = profile?.university_uuid ?? profile?.hospital_uuid ?? null;
      const institutions = institutionsResult.status === "fulfilled" ? institutionsResult.value : [];
      const institutionName = institutionUuid ? institutions.find((institution) => institution.uuid === institutionUuid)?.name ?? institutionUuid : null;
      let units: InstitutionUnitOption[] = [];
      if (institutionUuid && institutionsResult.status === "fulfilled") {
        try { units = await listInstitutionUnits(institutionUuid, auth.accessToken); }
        catch (error) { warnings.push(warningFrom("institutions", error)); }
      }

      detail = {
        user: userResponse.data,
        profile,
        authorization: authorizationResult.status === "fulfilled" ? authorizationResult.value.data : null,
        internships: internshipsResult.status === "fulfilled" ? internshipsResult.value.data : [],
        institutionName,
        units,
        warnings,
      };
    } catch (error) { failure = failureFrom(error); }
  }

  return <ProtectedShell actor={actor} user={currentUser}>{detail ? <UserDetail data={detail} /> : <UserDetailError failure={failure!} />}</ProtectedShell>;
}