import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/core/api/api-error";
import { apiRequest } from "@/core/api/http-client";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const response = await apiRequest<Record<string, unknown>>("/auth/v1/register", {
      method: "POST",
      body: {
        registration_claim_token: payload.registration_claim_token,
        password: payload.password,
        password_confirmation: payload.password_confirmation,
      },
    });
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) return NextResponse.json(error.problem ?? { title: error.message, status: error.status }, { status: error.status });
    return NextResponse.json({ title: "Inscription indisponible", status: 500 }, { status: 500 });
  }
}