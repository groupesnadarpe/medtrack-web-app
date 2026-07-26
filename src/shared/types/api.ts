export type ApiMeta = {
  request_id?: string;
  [key: string]: unknown;
};

// Enveloppe de réponse utilisée par plusieurs services Back-end Medtrack.
export type ApiEnvelope<TData> = {
  data: TData;
  meta?: ApiMeta;
};

export type PaginatedData<TItem> = {
  items: TItem[];
  page: number;
  per_page: number;
  total: number;
};
