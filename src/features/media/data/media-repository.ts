import { apiClient } from "@/core/api/http-client";
import type { ApiMutationResponse, PaginatedResponse, RepositoryRequestOptions, Uuid } from "@/core/api/api-types";
import type { MediaFile, MediaProcessingJob, SpreadsheetExtractionResult, UploadSession } from "@/features/media/domain/media";

export const mediaRepository = {
  list: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<MediaFile>>("/media/v1/media", options),

  get: (mediaUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<MediaFile>(`/media/v1/media/${mediaUuid}`, options),

  create: (payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse<MediaFile>>("/media/v1/media", payload, options),

  requestDownloadUrl: (mediaUuid: Uuid, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse<{ url?: string }>>(`/media/v1/media/${mediaUuid}/download-url`, {}, options),

  createUploadSession: (payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse<UploadSession>>("/media/v1/upload-sessions", payload, options),

  completeUploadSession: (sessionUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse<UploadSession>>(`/media/v1/upload-sessions/${sessionUuid}/complete`, payload, options),

  extractUploadedSpreadsheet: (file: File, options: RepositoryRequestOptions) => {
    const formData = new FormData();
    formData.append("file", file);

    // Endpoint direct pour obtenir le JSON extrait sans obliger le Front-end à gérer un média complet.
    return apiClient.post<ApiMutationResponse<SpreadsheetExtractionResult>>("/media/v1/spreadsheet-extractions", formData, options);
  },

  extractStoredSpreadsheet: (mediaUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse<MediaProcessingJob>>(`/media/v1/media/${mediaUuid}/spreadsheet-extractions`, payload, options),

  getProcessingJob: (jobUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<MediaProcessingJob>(`/media/v1/media-processing-jobs/${jobUuid}`, options),
};