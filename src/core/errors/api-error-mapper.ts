import { ApiError, type ApiProblem } from "@/core/api/api-error";
import type { AppErrorKind, AppErrorView, FieldErrors } from "@/core/errors/app-error";

function isApiProblem(value: unknown): value is ApiProblem {
  return typeof value === "object" && value !== null;
}

export function normalizeFieldErrors(errors: unknown): FieldErrors {
  if (!errors || typeof errors !== "object" || Array.isArray(errors)) {
    return {};
  }

  const normalized: FieldErrors = {};

  for (const [field, messages] of Object.entries(errors)) {
    if (Array.isArray(messages)) {
      normalized[field] = messages.map(String);
      continue;
    }

    if (typeof messages === "string") {
      normalized[field] = [messages];
    }
  }

  return normalized;
}

function resolveKind(status?: number): AppErrorKind {
  if (status === 422) return "validation";
  if (status === 401) return "unauthenticated";
  if (status === 403) return "forbidden";
  if (status === 404) return "not-found";
  if (status && status >= 500) return "server";

  return "unknown";
}

function titleForKind(kind: AppErrorKind): string {
  switch (kind) {
    case "validation":
      return "Certaines informations sont invalides";
    case "unauthenticated":
      return "Session expirée";
    case "forbidden":
      return "Accès interdit";
    case "not-found":
      return "Ressource introuvable";
    case "network":
      return "API indisponible";
    case "server":
      return "Erreur serveur";
    default:
      return "Une erreur est survenue";
  }
}

function messageForKind(kind: AppErrorKind): string {
  switch (kind) {
    case "validation":
      return "Vérifie les champs du formulaire puis réessaie.";
    case "unauthenticated":
      return "Reconnecte-toi pour continuer.";
    case "forbidden":
      return "Ton compte n'a pas l'autorisation nécessaire pour cette action.";
    case "not-found":
      return "L'élément demandé n'existe pas ou n'est plus disponible.";
    case "network":
      return "Impossible de joindre l'API Medtrack. Vérifie la connexion ou réessaie dans un instant.";
    case "server":
      return "Le serveur a rencontré une erreur. Si le problème persiste, transmets le request_id au support.";
    default:
      return "Réessaie dans un instant. Si le problème persiste, contacte le support.";
  }
}

export function mapApiError(error: unknown): AppErrorView {
  if (error instanceof ApiError) {
    const problem = isApiProblem(error.problem) ? error.problem : undefined;
    const kind = resolveKind(error.status);

    return {
      kind,
      title: problem?.title ?? titleForKind(kind),
      message: problem?.detail ?? messageForKind(kind),
      status: error.status,
      code: problem?.code,
      requestId: problem?.request_id,
      fieldErrors: normalizeFieldErrors(problem?.errors),
      shouldInviteLogin: kind === "unauthenticated",
    };
  }

  if (error instanceof TypeError) {
    return {
      kind: "network",
      title: titleForKind("network"),
      message: messageForKind("network"),
      fieldErrors: {},
      shouldInviteLogin: false,
    };
  }

  return {
    kind: "unknown",
    title: titleForKind("unknown"),
    message: error instanceof Error ? error.message : messageForKind("unknown"),
    fieldErrors: {},
    shouldInviteLogin: false,
  };
}

export function firstFieldError(fieldErrors: FieldErrors, fieldName: string): string | undefined {
  return fieldErrors[fieldName]?.[0];
}