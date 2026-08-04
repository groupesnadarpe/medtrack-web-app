import { actorAreas } from "@/config/actors";
import { ApiError } from "@/core/api/api-error";
import { requireActorAccess } from "@/core/auth/guards";
import { institutionStatuses, institutionTypes, verificationStatuses, type Availability, type InstitutionFilters, type InstitutionListMeta, type ManagedInstitution } from "@/features/medtrack-institutions/domain/institution-management";
import { listInstitutions } from "@/features/medtrack-institutions/infrastructure/institution-management-api";
import { InstitutionManagement } from "@/features/medtrack-institutions/ui/institution-management";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "medtrack")!;
const emptyMeta: InstitutionListMeta = { current_page: 1, last_page: 1, per_page: 20, total: 0 };
type Params = Promise<Record<string, string | string[] | undefined>>;
function scalar(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }
function member<T extends string>(value: string | undefined, allowed: readonly T[]): T | undefined { return value && allowed.includes(value as T) ? value as T : undefined; }

/** Page serveur : le jeton reste dans la session chiffrée et n’est jamais injecté dans le HTML. */
export default async function InstitutionsPage({ searchParams }: Readonly<{ searchParams: Params }>) {
  const { user, auth } = await requireActorAccess("medtrack"); const query = await searchParams; const parsedPage = Number.parseInt(scalar(query.page) ?? "1", 10);
  const search = scalar(query.search)?.trim().slice(0, 100); const filters: InstitutionFilters = { page: Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1, perPage: 20, search: search && search.length >= 2 ? search : undefined, institutionType: member(scalar(query.institution_type), institutionTypes), status: member(scalar(query.status), institutionStatuses), verificationStatus: member(scalar(query.verification_status), verificationStatuses) };
  let institutions: ManagedInstitution[] = []; let meta = emptyMeta; let availability: Availability = { kind: "ready" };
  try { const result = await listInstitutions(auth.accessToken, filters); institutions = result.data; meta = result.meta; } catch (error) { availability = error instanceof ApiError ? { kind: error.status === 403 ? "forbidden" : "unavailable", message: error.message, requestId: error.problem?.request_id } : { kind: "unavailable", message: "Impossible de joindre institution-service pour le moment." }; }
  const canManage = user.roles.some((role) => ["SUPER_ADMIN", "MEDTRACK_ADMIN"].includes(role));
  return <ProtectedShell actor={actor} user={user}><InstitutionManagement institutions={institutions} meta={meta} filters={filters} availability={availability} canManage={canManage} /></ProtectedShell>;
}