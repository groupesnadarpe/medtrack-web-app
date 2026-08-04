import { apiClient } from "@/core/api/http-client";
import type { ApiEnvelope } from "@/shared/types/api";
import type { ManagedUser } from "@/features/medtrack-users/domain/user-management";
import type {
  InstitutionUnitOption,
  UserAuthorization,
  UserInternship,
  UserProfileDetail,
} from "@/features/medtrack-users/domain/user-detail";

type InternshipListResponse = ApiEnvelope<UserInternship[]>;
type UnitApi = { uuid?: string; name?: string | null; code?: string | null; unit_type?: string | null };
type UnitListResponse = { data: UnitApi[] };

/** Toutes ces lectures passent par Kong et utilisent exclusivement le JWT serveur HTTP-only. */
export function getManagedUser(userUuid: string, accessToken: string) {
  return apiClient.get<ApiEnvelope<ManagedUser>>(`/auth/v1/users/${userUuid}`, { accessToken });
}

export function getManagedUserProfile(userUuid: string, accessToken: string) {
  return apiClient.get<ApiEnvelope<UserProfileDetail>>(`/auth/v1/users/${userUuid}/profile`, { accessToken });
}

export function getManagedUserAuthorization(userUuid: string, accessToken: string) {
  return apiClient.get<ApiEnvelope<UserAuthorization>>(`/auth/v1/users/${userUuid}/authorizations`, { accessToken });
}

export function listUserInternships(userUuid: string, accessToken: string) {
  return apiClient.get<InternshipListResponse>("/internship/v1/internships", {
    accessToken,
    query: { student_uuid: userUuid, per_page: 100 },
  });
}

export async function listInstitutionUnits(institutionUuid: string, accessToken: string): Promise<InstitutionUnitOption[]> {
  const response = await apiClient.get<UnitListResponse>(`/institution/v1/institutions/${institutionUuid}/units`, {
    accessToken,
    query: { per_page: 100 },
  });

  return response.data
    .filter((unit): unit is UnitApi & { uuid: string } => Boolean(unit.uuid))
    .map((unit) => ({ uuid: unit.uuid, name: unit.name ?? unit.code ?? unit.uuid, code: unit.code, unitType: unit.unit_type }));
}