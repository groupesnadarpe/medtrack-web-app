import { actorAreas } from "@/config/actors";
import { ApiError } from "@/core/api/api-error";
import { requireActorAccess } from "@/core/auth/guards";
import type { AccountValidation, Availability, ValidationStatus } from "@/features/medtrack-institutions/domain/institution-management";
import { listAccountValidations } from "@/features/medtrack-institutions/infrastructure/institution-management-api";
import { AccountValidationManagement } from "@/features/medtrack-institutions/ui/account-validation-management";
import { ProtectedShell } from "@/shared/components/layout/protected-shell";

const actor = actorAreas.find((item) => item.key === "medtrack")!; type Params = Promise<Record<string, string | string[] | undefined>>;
/** Liste serveur des validations ; seules les mutations utilisent les proxies BFF dédiés. */
export default async function AccountValidationsPage({ searchParams }: Readonly<{ searchParams: Params }>) {
  const { user, auth } = await requireActorAccess("medtrack"); const query = await searchParams; const raw = Array.isArray(query.status) ? query.status[0] : query.status; const filter = raw && ["PENDING", "APPROVED", "REJECTED"].includes(raw) ? raw as ValidationStatus : undefined;
  let validations: AccountValidation[] = []; let availability: Availability = { kind: "ready" };
  try { validations = await listAccountValidations(auth.accessToken, filter); } catch (error) { availability = error instanceof ApiError ? { kind: error.status === 403 ? "forbidden" : "unavailable", message: error.message, requestId: error.problem?.request_id } : { kind: "unavailable", message: "Impossible de joindre auth-service pour le moment." }; }
  return <ProtectedShell actor={actor} user={user}><AccountValidationManagement validations={validations} filter={filter} availability={availability} canReview={user.roles.includes("SUPER_ADMIN")} /></ProtectedShell>;
}