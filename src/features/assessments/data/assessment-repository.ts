import { apiClient } from "@/core/api/http-client";
import type { ApiMutationResponse, PaginatedResponse, RepositoryRequestOptions, Uuid } from "@/core/api/api-types";
import type { AcademicDecision, AssessmentReport, Evaluation, EvaluationTemplate } from "@/features/assessments/domain/assessment";

export const assessmentRepository = {
  listEvaluationTemplates: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<EvaluationTemplate>>("/assessment/v1/evaluation-templates", options),

  listEvaluations: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<Evaluation>>("/assessment/v1/evaluations", options),

  submitEvaluation: (evaluationUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>(`/assessment/v1/evaluations/${evaluationUuid}/submit`, payload, options),

  validateEvaluation: (evaluationUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>(`/assessment/v1/evaluations/${evaluationUuid}/validate`, payload, options),

  // L'OpenAPI expose une création de rapport, pas encore une liste globale de rapports.
  createReport: (payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse<AssessmentReport>>("/assessment/v1/reports", payload, options),

  getAcademicDecision: (decisionUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<AcademicDecision>(`/assessment/v1/academic-decisions/${decisionUuid}`, options),
};