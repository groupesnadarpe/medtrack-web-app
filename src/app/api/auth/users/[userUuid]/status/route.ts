import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/core/api/api-error";
import { apiRequest } from "@/core/api/http-client";
import { getServerAuthSession } from "@/core/auth/auth-session";
import { isSameOriginRequest } from "@/core/security/same-origin";

type RouteContext = { params: Promise<{ userUuid: string }> };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


/** Proxy de mutation strict : aucun statut arbitraire ni motif fourni par le navigateur n’est transmis. */
export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ title: "Origine interdite" }, { status: 403 });
  const session = await getServerAuthSession();
  if (!session) return NextResponse.json({ title: "Session expirée" }, { status: 401 });

  const { userUuid } = await context.params;
  if (!uuidPattern.test(userUuid)) return NextResponse.json({ title: "UUID utilisateur invalide" }, { status: 422 });

  const payload = await request.json().catch(() => null) as { status?: unknown } | null;
  if (payload?.status !== "ACTIVE" && payload?.status !== "DISABLED") {
    return NextResponse.json({ title: "Statut non autorisé" }, { status: 422 });
  }

  try {
    const response = await apiRequest<Record<string, unknown>>(`/auth/v1/users/${userUuid}/status`, {
      method: "PATCH",
      token: session.accessToken,
      body: { status: payload.status, reason: "medtrack_admin_manual_action" },
    });
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(error.problem ?? { title: error.message, status: error.status }, { status: error.status });
    }
    return NextResponse.json({ title: "Auth-service indisponible", status: 503 }, { status: 503 });
  }
}