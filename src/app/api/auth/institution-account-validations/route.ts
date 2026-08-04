import { type NextRequest, NextResponse } from "next/server";

const apiBaseUrl = (process.env.MEDTRACK_API_BASE_URL ?? "http://kong:8000/api").replace(/\/$/, "");

/**
 * Finalise le compte administrateur via la route anonyme contrôlée par Kong.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const response = await fetch(`${apiBaseUrl}/auth/v1/account-validations/institution-onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        code: "ACCOUNT_VALIDATION_UNAVAILABLE",
        message: "Le service de validation de compte est momentanément indisponible.",
      },
      { status: 503 },
    );
  }
}