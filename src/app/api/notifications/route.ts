import { NextResponse } from "next/server";
import { getCurrentSession } from "@/core/auth/auth-session";
import { listNotificationsForUser } from "@/features/notifications/infrastructure/notification-api";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ data: [], message: "Session expirée." }, { status: 401 });
  }

  const notifications = await listNotificationsForUser(session.user.uuid, session.auth.accessToken);

  return NextResponse.json({ data: notifications });
}