import { NextResponse } from "next/server";
import { getCurrentSession } from "@/core/auth/auth-session";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ data: { authenticated: false, user: null, default_path: null } }, { status: 200 });
  }

  return NextResponse.json({
    data: {
      authenticated: true,
      user: session.user,
      default_path: session.defaultPath,
    },
  });
}