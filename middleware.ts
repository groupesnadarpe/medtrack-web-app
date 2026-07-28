import { NextResponse } from "next/server";

// Contrôle d'accès temporairement neutralisé pendant la construction des interfaces mock.
// IMPORTANT : restaurer la validation de session avant toute connexion à l'API ou mise en production.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/university/:path*",
    "/hospital/:path*",
    "/ordre-de-medecin/:path*",
    "/ministere/:path*",
    "/medtrack/:path*",
  ],
};