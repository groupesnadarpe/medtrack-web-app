import { actorAreas } from "@/config/actors";
import { ApiError } from "@/core/api/api-error";
import { requireActorAccess } from "@/core/auth/guards";
import {
  accountTypes,
  userStatuses,
  type AccountType,
  type ManagedUser,
  type UserFilters,
  type UserListMeta,
  type UserManagementAvailability,
  type UserStatus,
} from "@/features/medtrack-users/domain/user-management";
import {
  listInstitutionOptions,
  listManagedUsers,
} from "@/features/medtrack-users/infrastructure/user-management-api";
import { UserManagement } from "@/features/medtrack-users/ui/user-management";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "medtrack")!;
const emptyMeta: UserListMeta = {
  page: 1,
  per_page: 25,
  total: 0,
  last_page: 1,
  summary: { total_users: 0, active_students: 0, supervisors: 0, administrators: 0 },
};

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

function scalar(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function enumValue<T extends string>(value: string | undefined, allowed: readonly T[]): T | undefined {
  return value && allowed.includes(value as T) ? (value as T) : undefined;
}

function validUuid(value: string | undefined): string | undefined {
  return value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : undefined;
}

/** Page serveur : le JWT HTTP-only reste inaccessible au composant client et aux exports CSV. */
export default async function MedtrackUsersPage({ searchParams }: Readonly<{ searchParams: PageSearchParams }>) {
  const { user, auth } = await requireActorAccess("medtrack");
  const query = await searchParams;
  const filters: UserFilters = {
    page: positiveInteger(scalar(query.page), 1),
    perPage: 25,
    accountType: enumValue<AccountType>(scalar(query.account_type), accountTypes),
    status: enumValue<UserStatus>(scalar(query.status), userStatuses),
    institutionUuid: validUuid(scalar(query.institution_uuid)),
    search: scalar(query.search)?.trim().slice(0, 255) || undefined,
  };

  const [usersResult, institutionsResult] = await Promise.allSettled([
    listManagedUsers(auth.accessToken, filters),
    listInstitutionOptions(auth.accessToken),
  ]);

  let users: ManagedUser[] = [];
  let meta = emptyMeta;
  let availability: UserManagementAvailability = { kind: "ready" };

  if (usersResult.status === "fulfilled") {
    users = usersResult.value.data;
    meta = usersResult.value.meta;
  } else {
    const error = usersResult.reason;
    availability = error instanceof ApiError
      ? {
          kind: error.status === 403 ? "forbidden" : "unavailable",
          message: error.message,
          requestId: error.problem?.request_id,
        }
      : { kind: "unavailable", message: "Impossible de joindre le service d’identité pour le moment." };
  }

  const institutions = institutionsResult.status === "fulfilled" ? institutionsResult.value : [];

  return (
    <ProtectedShell actor={actor} user={user}>
      <UserManagement
        users={users}
        meta={meta}
        filters={filters}
        institutions={institutions}
        institutionsAvailable={institutionsResult.status === "fulfilled"}
        availability={availability}
      />
    </ProtectedShell>
  );
}