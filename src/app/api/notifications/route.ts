import { NextResponse } from "next/server";
import { ApiError } from "@/core/api/api-error";
import { getCurrentSession } from "@/core/auth/auth-session";
import { listNotificationsForUser } from "@/features/notifications/infrastructure/notification-api";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ data: [], message: "Session expirée." }, { status: 401 });
  }

  try {
    const notifications = await listNotificationsForUser(session.user.uuid, session.auth.accessToken);

    return NextResponse.json({ data: notifications, degraded: false });
  } catch (error) {
    // Une erreur d’identité ou d’autorisation reste bloquante et ne doit jamais être masquée.
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return NextResponse.json(
        {
          data: [],
          message: error.message,
          request_id: error.problem?.request_id,
        },
        { status: error.status },
      );
    }

    // Le Header reste utilisable lorsque notification-service n’est pas lancé en environnement local.
    return NextResponse.json({
      data: [],
      degraded: true,
      message: "Le service de notifications est temporairement indisponible.",
      request_id: error instanceof ApiError ? error.problem?.request_id : null,
    });
  }
}