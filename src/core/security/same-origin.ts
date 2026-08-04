import type { NextRequest } from "next/server";

/**
 * Protège les mutations BFF contre les requêtes cross-site.
 *
 * `request.url` peut contenir le nom interne du conteneur Next. Le navigateur,
 * lui, connaît l'hôte public présent dans `Host`. La comparaison porte donc sur
 * l'hôte et le port publics, tout en tolérant une terminaison TLS par Nginx.
 */
export function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");

  // Les appels serveur-à-serveur et certains clients non navigateur n'envoient
  // pas Origin. Ils restent soumis à la session, aux rôles et au contrôle JWT.
  if (!origin) return true;

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return false;
  }

  try {
    const originHost = new URL(origin).host.toLowerCase();
    const publicHost = request.headers.get("host")
      ?? request.headers.get("x-forwarded-host")?.split(",", 1)[0]?.trim();

    return Boolean(publicHost) && originHost === publicHost?.toLowerCase();
  } catch {
    return false;
  }
}