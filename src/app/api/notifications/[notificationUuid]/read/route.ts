import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/core/auth/auth-session";
import { markNotificationAsRead } from "@/features/notifications/infrastructure/notification-api";

type RouteContext = {
  params: Promise<{ notificationUuid: string }>;
};

export async function PATCH(_request: Request, context: RouteContext) {
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json({ message: "Session expirée." }, { status: 401 });
  }

  const { notificationUuid } = await context.params;
  await markNotificationAsRead(notificationUuid, session.accessToken);

  return NextResponse.json({ data: { read: true } });
}