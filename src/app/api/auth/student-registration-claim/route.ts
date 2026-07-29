import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/core/api/api-error";
import { apiRequest } from "@/core/api/http-client";

type ClaimResponse = { data: { registration_claim_token: string; expires_at?: string } };

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const response = await apiRequest<ClaimResponse>("/academic/v1/student-registration-claims", {
      method: "POST",
      body: {
        student_matricule_number: payload.student_matricule_number,
        university_uuid: payload.university_uuid,
        academic_year: payload.academic_year,
      },
    });
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) return NextResponse.json(error.problem ?? { title: error.message, status: error.status }, { status: error.status });
    return NextResponse.json({ title: "Vérification académique indisponible", status: 500 }, { status: 500 });
  }
}