import { apiClient } from "@/core/api/http-client";
import type { ApiEnvelope } from "@/shared/types/api";
import type {
  InstitutionOption,
  ManagedUser,
  UserFilters,
  UserListMeta,
} from "@/features/medtrack-users/domain/user-management";

type UserListResponse = ApiEnvelope<ManagedUser[]> & { meta: UserListMeta };

type InstitutionApi = {
  uuid?: string;
  display_name?: string | null;
  legal_name?: string | null;
  official_code?: string | null;
};

type InstitutionListResponse = {
  data: InstitutionApi[];
};

/** Charge les utilisateurs via Kong avec le JWT serveur, sans exposer le jeton au navigateur. */
export function listManagedUsers(accessToken: string, filters: UserFilters): Promise<UserListResponse> {
  return apiClient.get<UserListResponse>("/auth/v1/users", {
    accessToken,
    query: {
      page: filters.page,
      per_page: filters.perPage,
      account_type: filters.accountType,
      status: filters.status,
      institution_uuid: filters.institutionUuid,
      search: filters.search,
    },
  });
}

/** Résout les UUID d’établissement ; un échec de ce service ne doit jamais masquer la liste des comptes. */
export async function listInstitutionOptions(accessToken: string): Promise<InstitutionOption[]> {
  const response = await apiClient.get<InstitutionListResponse>("/institution/v1/institutions", {
    accessToken,
    query: { per_page: 100 },
  });

  return response.data
    .filter((institution): institution is InstitutionApi & { uuid: string } => Boolean(institution.uuid))
    .map((institution) => ({
      uuid: institution.uuid,
      name: institution.display_name ?? institution.legal_name ?? institution.official_code ?? institution.uuid,
    }))
    .sort((left, right) => left.name.localeCompare(right.name, "fr"));
}