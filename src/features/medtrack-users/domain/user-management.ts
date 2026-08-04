export const accountTypes = [
  "STUDENT",
  "MEDICAL_STAFF",
  "UNIVERSITY_STAFF",
  "HOSPITAL_ADMIN",
  "UNIVERSITY_ADMIN",
  "MEDTRACK_ADMIN",
  "MEDICAL_ORDER_ADMIN",
  "MINISTRY_AGENT",
  "SERVICE_ACCOUNT",
] as const;

export const userStatuses = [
  "PENDING",
  "PENDING_VALIDATION",
  "ACTIVE",
  "SUSPENDED",
  "DISABLED",
  "LOCKED",
  "ARCHIVED",
] as const;

export type AccountType = (typeof accountTypes)[number];
export type UserStatus = (typeof userStatuses)[number];

export type ManagedUserProfile = {
  uuid?: string | null;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  gender?: string | null;
  avatar_media_uuid?: string | null;
  hospital_uuid?: string | null;
  service_uuid?: string | null;
  university_uuid?: string | null;
  faculty_uuid?: string | null;
  department_uuid?: string | null;
  field_uuid?: string | null;
  promotion?: string | null;
  academic_year?: string | null;
};

export type ManagedUser = {
  uuid: string;
  fullname?: string | null;
  email?: string | null;
  phone_number?: string | null;
  student_matricule_number?: string | null;
  account_type: AccountType | string;
  status: UserStatus | string;
  profile?: ManagedUserProfile | null;
  created_at?: string | null;
};

export type UserSummary = {
  total_users: number;
  active_students: number;
  supervisors: number;
  administrators: number;
};

export type UserListMeta = {
  page: number;
  per_page: number;
  total: number;
  last_page: number;
  request_id?: string | null;
  summary: UserSummary;
};

export type UserFilters = {
  page: number;
  perPage: number;
  accountType?: AccountType;
  status?: UserStatus;
  institutionUuid?: string;
  search?: string;
};

export type InstitutionOption = {
  uuid: string;
  name: string;
};

export type UserManagementAvailability = {
  kind: "ready" | "unavailable" | "forbidden";
  message?: string;
  requestId?: string | null;
};