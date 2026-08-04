import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/core/api/api-error";
import { apiRequest } from "@/core/api/http-client";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const response = await apiRequest<Record<string, unknown>>("/auth/v1/auth/password/reset", {
      method: "POST",
      body: {
        email: payload.email,
        token: payload.token,
        new_password: payload.new_password,
        new_password_confirmation: payload.new_password_confirmation,
      },
    });
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ApiError) return NextResponse.json(error.problem ?? { title: error.message, status: error.status }, { status: error.status });
    return NextResponse.json({ title: "Service de réinitialisation indisponible", status: 503 }, { status: 503 });
  }
}