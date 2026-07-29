/**
 * Utilitaires communs à toutes les fixtures.
 *
 * Règle du projet : une fixture doit toujours respecter la forme renvoyée par l'API
 * (snake_case, enveloppe { data, meta }, uuid, timestamps ISO 8601). Ainsi le passage
 * de `env.useMocks = true` à `false` ne demande aucune retouche des écrans.
 */
import type { ApiEnvelope, ApiMeta, PaginatedData } from "@/shared/types/api";

/** Simule la latence réseau afin de rendre les états de chargement réellement visibles. */
export function mockLatency(ms = 450): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function mockRequestId(): string {
  return `mock_${Math.random().toString(36).slice(2, 10)}`;
}

export function mockMeta(extra: ApiMeta = {}): ApiMeta {
  return { request_id: mockRequestId(), mocked: true, ...extra };
}

export function mockEnvelope<TData>(data: TData, extra: ApiMeta = {}): ApiEnvelope<TData> {
  return { data, meta: mockMeta(extra) };
}

export function mockPaginated<TItem>(items: TItem[], page = 1, perPage = 20): PaginatedData<TItem> {
  return { items, page, per_page: perPage, total: items.length };
}
