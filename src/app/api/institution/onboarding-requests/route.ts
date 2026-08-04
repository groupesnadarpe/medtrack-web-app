import { type NextRequest, NextResponse } from "next/server";

const apiBaseUrl = (process.env.MEDTRACK_API_BASE_URL ?? "http://kong:8000/api").replace(/\/$/, "");

/**
 * Transmet la demande publique à Kong afin que l'appel interne soit signé.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const response = await fetch(`${apiBaseUrl}/institution/v1/onboarding-requests`, {
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
        code: "INSTITUTION_ONBOARDING_UNAVAILABLE",
        message: "Le service de demande institutionnelle est momentanément indisponible.",
      },
      { status: 503 },
    );
  }
}