export type Uuid = string;
export type UnknownRecord = Record<string, unknown>;
export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue | QueryValue[]>;

export type PaginatedResponse<TItem> = {
  data: TItem[];
  links?: UnknownRecord;
  meta?: UnknownRecord;
};

export type ApiMutationResponse<TData = UnknownRecord> = {
  data?: TData;
  message?: string;
  [key: string]: unknown;
};

export type RepositoryRequestOptions = {
  accessToken?: string;
  idempotencyKey?: string;
  requestId?: string;
  query?: QueryParams;
};