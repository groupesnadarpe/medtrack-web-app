import { type NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/core/api/api-error";
import { apiRequest } from "@/core/api/http-client";
import { getCurrentSession } from "@/core/auth/auth-session";
import { isSameOriginRequest } from "@/core/security/same-origin";

const types = new Set(["UNIVERSITY", "HOSPITAL", "HEALTH_CENTER", "CLINIC", "MINISTRY", "MEDICAL_ORDER", "MEDTRACK", "OTHER"]);
function text(value: unknown, maximum: number) { return typeof value === "string" ? value.trim().slice(0, maximum) : ""; }

/** Proxy de création : session, rôle, origine et schéma sont contrôlés avant Kong. */
export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ title: "Origine interdite" }, { status: 403 });
  const session = await getCurrentSession(); if (!session) return NextResponse.json({ title: "Session expirée" }, { status: 401 });
  if (!session.user.roles.some((role) => ["SUPER_ADMIN", "MEDTRACK_ADMIN"].includes(role))) return NextResponse.json({ title: "Accès interdit" }, { status: 403 });
  const input = await request.json().catch(() => null) as Record<string, unknown> | null; const institutionType = text(input?.institution_type, 30); const legalName = text(input?.legal_name, 255); const displayName = text(input?.display_name, 255) || legalName;
  if (!types.has(institutionType) || legalName.length < 2) return NextResponse.json({ title: "Données institutionnelles invalides", errors: { legal_name: ["Le nom légal est obligatoire."], institution_type: ["Le type est invalide."] } }, { status: 422 });
  const payload = { institution_type: institutionType, legal_name: legalName, display_name: displayName, official_code: text(input?.official_code, 100) || null, registration_number: text(input?.registration_number, 150) || null, description: text(input?.description, 5000) || null };
  try { const response = await apiRequest<Record<string, unknown>>("/institution/v1/institutions", { method: "POST", accessToken: session.auth.accessToken, body: payload }); return NextResponse.json(response, { status: 201 }); } catch (error) { if (error instanceof ApiError) return NextResponse.json(error.problem ?? { title: error.message }, { status: error.status }); return NextResponse.json({ title: "Institution-service indisponible" }, { status: 503 }); }
}