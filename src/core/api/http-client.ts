import { env } from "@/config/env";
import { ApiError, type ApiProblem } from "@/core/api/api-error";
import type { QueryParams, RepositoryRequestOptions } from "@/core/api/api-types";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequestOptions = Omit<RequestInit, "body" | "headers"> &
  RepositoryRequestOptions & {
    method?: HttpMethod;
    token?: string;
    body?: BodyInit | Record<string, unknown> | unknown[] | null;
    headers?: HeadersInit;
    cache?: RequestCache;
  };

function buildQueryString(query?: QueryParams): string {
  if (!query) return "";

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    const values = Array.isArray(value) ? value : [value];

    for (const item of values) {
      if (item === null || item === undefined) continue;
      params.append(key, String(item));
    }
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

function buildApiUrl(path: `/${string}`, query?: QueryParams): string {
  const baseUrl = env.apiBaseUrl.replace(/\/+$/, "");

  return `${baseUrl}${path}${buildQueryString(query)}`;
}

function isJsonBody(body: ApiRequestOptions["body"]): body is Record<string, unknown> | unknown[] {
  return body !== null && body !== undefined && !(body instanceof FormData) && !(body instanceof Blob) && typeof body !== "string";
}

async function readPayloadSafely(response: Response): Promise<unknown> {
  if (response.status === 204) return null;

  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError("La réponse API n'est pas un JSON valide.", response.status);
  }
}

// Client HTTP commun à toutes les features.
// Il parle uniquement à l'API publique via Kong/Nginx, jamais directement aux services Laravel.
export async function apiRequest<TResponse>(path: `/${string}`, options: ApiRequestOptions = {}): Promise<TResponse> {
  const headers = new Headers(options.headers);
  const body = isJsonBody(options.body) ? JSON.stringify(options.body) : options.body;
  const bearerToken = options.token ?? options.accessToken;

  headers.set("Accept", "application/json");

  // Ne jamais fixer Content-Type pour FormData : le navigateur doit ajouter le boundary multipart.
  if (isJsonBody(options.body) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (bearerToken) {
    headers.set("Authorization", `Bearer ${bearerToken}`);
  }

  if (options.idempotencyKey) {
    headers.set("Idempotency-Key", options.idempotencyKey);
  }

  if (options.requestId) {
    headers.set("X-Request-Id", options.requestId);
  }

  const response = await fetch(buildApiUrl(path, options.query), {
    ...options,
    method: options.method ?? "GET",
    headers,
    body,
    cache: options.cache ?? "no-store",
  });

  const payload = await readPayloadSafely(response);

  if (!response.ok) {
    const problem = typeof payload === "object" && payload !== null ? (payload as ApiProblem) : undefined;
    throw new ApiError(problem?.detail ?? problem?.title ?? problem?.message ?? "Erreur API Medtrack", response.status, problem);
  }

  return payload as TResponse;
}

export const apiClient = {
  get: <TResponse>(path: `/${string}`, options?: ApiRequestOptions) =>
    apiRequest<TResponse>(path, { ...options, method: "GET" }),
  post: <TResponse>(path: `/${string}`, body?: ApiRequestOptions["body"], options?: ApiRequestOptions) =>
    apiRequest<TResponse>(path, { ...options, method: "POST", body }),
  put: <TResponse>(path: `/${string}`, body?: ApiRequestOptions["body"], options?: ApiRequestOptions) =>
    apiRequest<TResponse>(path, { ...options, method: "PUT", body }),
  patch: <TResponse>(path: `/${string}`, body?: ApiRequestOptions["body"], options?: ApiRequestOptions) =>
    apiRequest<TResponse>(path, { ...options, method: "PATCH", body }),
  delete: <TResponse>(path: `/${string}`, options?: ApiRequestOptions) =>
    apiRequest<TResponse>(path, { ...options, method: "DELETE" }),
};