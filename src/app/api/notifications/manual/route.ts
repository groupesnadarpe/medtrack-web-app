import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/core/api/api-error";
import { apiRequest } from "@/core/api/http-client";
import { getServerAuthSession } from "@/core/auth/auth-session";
import { isSameOriginRequest } from "@/core/security/same-origin";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Construit côté serveur le payload de notification afin d’empêcher le ciblage ou les canaux arbitraires. */
export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ title: "Origine interdite" }, { status: 403 });
  const session = await getServerAuthSession();
  if (!session) return NextResponse.json({ title: "Session expirée" }, { status: 401 });

  const input = await request.json().catch(() => null) as { userUuid?: unknown; title?: unknown; body?: unknown } | null;
  const userUuid = typeof input?.userUuid === "string" ? input.userUuid : "";
  const title = typeof input?.title === "string" ? input.title.trim() : "";
  const body = typeof input?.body === "string" ? input.body.trim() : "";

  if (!uuidPattern.test(userUuid) || title.length < 2 || title.length > 200 || body.length < 2 || body.length > 2000) {
    return NextResponse.json({ title: "Notification invalide", status: 422 }, { status: 422 });
  }

  const idempotencyKey = crypto.randomUUID();
  try {
    const response = await apiRequest<Record<string, unknown>>("/notifications/v1/notifications", {
      method: "POST",
      token: session.accessToken,
      idempotencyKey,
      body: {
        notification_type: "admin.manual",
        title,
        body,
        priority: "NORMAL",
        channels: ["IN_APP"],
        subject_type: "USER",
        subject_uuid: userUuid,
        idempotency_key: idempotencyKey,
        recipients: [{ recipient_type: "USER", user_uuid: userUuid, channels: ["IN_APP"] }],
      },
    });
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(error.problem ?? { title: error.message, status: error.status }, { status: error.status });
    }
    return NextResponse.json({ title: "Notification-service indisponible", status: 503 }, { status: 503 });
  }
}