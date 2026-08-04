import { apiClient } from "@/core/api/http-client";
import type { ApiEnvelope } from "@/shared/types/api";
import type { AccountValidation, InstitutionFilters, InstitutionListMeta, ManagedInstitution, ValidationStatus } from "@/features/medtrack-institutions/domain/institution-management";

type InstitutionListResponse = { data: ManagedInstitution[]; meta: InstitutionListMeta };
type ValidationListResponse = ApiEnvelope<AccountValidation[]>;

/** Lit le registre réel via Kong. Le JWT ne quitte jamais le rendu serveur. */
export function listInstitutions(accessToken: string, filters: InstitutionFilters): Promise<InstitutionListResponse> {
  return apiClient.get<InstitutionListResponse>("/institution/v1/institutions", {
    accessToken,
    query: {
      page: filters.page,
      per_page: filters.perPage,
      search: filters.search,
      institution_type: filters.institutionType,
      status: filters.status,
      verification_status: filters.verificationStatus,
    },
  });
}

/** Charge les demandes de validation exposées par auth-service. */
export async function listAccountValidations(accessToken: string, status?: ValidationStatus): Promise<AccountValidation[]> {
  const response = await apiClient.get<ValidationListResponse>("/auth/v1/admin/account-validations", {
    accessToken,
    query: { status },
  });
  return response.data;
}