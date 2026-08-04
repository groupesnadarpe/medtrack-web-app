import type { ManagedUser, ManagedUserProfile } from "@/features/medtrack-users/domain/user-management";

export type UserProfileDetail = ManagedUserProfile & {
  user_uuid?: string | null;
  display_name?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  service_uuid?: string | null;
  faculty_uuid?: string | null;
  department_uuid?: string | null;
  field_uuid?: string | null;
  promotion?: string | null;
  academic_year?: string | null;
};

export type UserRole = {
  uuid?: string;
  code: string;
  name?: string | null;
  status?: string | null;
};

export type UserAuthorization = {
  roles: UserRole[];
  permissions: Array<{ code: string; name?: string | null; module?: string | null }>;
  scopes: Array<{
    assignment_uuid?: string;
    role_code?: string;
    scope_type?: string;
    scope_uuid?: string | null;
    starts_at?: string | null;
    ends_at?: string | null;
  }>;
};

export type UserInternship = {
  uuid: string;
  host_name_snapshot?: string | null;
  host_institution_uuid?: string | null;
  status?: string | null;
  planned_start_date?: string | null;
  planned_end_date?: string | null;
  actual_start_date?: string | null;
  actual_end_date?: string | null;
  status_changed_at?: string | null;
  created_at?: string | null;
};

export type InstitutionUnitOption = {
  uuid: string;
  name: string;
  code?: string | null;
  unitType?: string | null;
};

export type OptionalServiceState = {
  service: "profile" | "authorizations" | "institutions" | "internships";
  message: string;
  requestId?: string | null;
};

export type UserDetailData = {
  user: ManagedUser & {
    login_methods?: { matricule?: boolean; email?: boolean; phone?: boolean };
    must_change_password?: boolean;
    email_verified_at?: string | null;
    phone_verified_at?: string | null;
    last_login_at?: string | null;
  };
  profile: UserProfileDetail | null;
  authorization: UserAuthorization | null;
  internships: UserInternship[];
  institutionName: string | null;
  units: InstitutionUnitOption[];
  warnings: OptionalServiceState[];
};

export type UserDetailFailure = {
  kind: "not-found" | "forbidden" | "unavailable";
  message: string;
  requestId?: string | null;
};