import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/core/api/api-error";
import { apiRequest } from "@/core/api/http-client";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const response = await apiRequest<Record<string, unknown>>("/auth/v1/auth/password/forgot", {
      method: "POST",
      body: { email: payload.email },
    });
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ApiError) return NextResponse.json(error.problem ?? { title: error.message, status: error.status }, { status: error.status });
    return NextResponse.json({ title: "Service de récupération indisponible", status: 503 }, { status: 503 });
  }
}