import { apiClient } from "@/core/api/http-client";
import type { ApiMutationResponse, PaginatedResponse, RepositoryRequestOptions, Uuid } from "@/core/api/api-types";
import type { FinancialObligation, FinancialStatus, PaymentTransaction, RefundRequest } from "@/features/payments/domain/payment";

export const paymentRepository = {
  listObligations: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<FinancialObligation>>("/payment/v1/financial-obligations", options),

  getObligation: (obligationUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<FinancialObligation>(`/payment/v1/financial-obligations/${obligationUuid}`, options),

  checkoutObligation: (obligationUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>(`/payment/v1/financial-obligations/${obligationUuid}/checkout`, payload, options),

  getStudentFinancialStatus: (studentUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<FinancialStatus>(`/payment/v1/students/${studentUuid}/financial-status`, options),

  listTransactions: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<PaymentTransaction>>("/payment/v1/payment-transactions", options),

  retryTransaction: (transactionUuid: Uuid, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>(`/payment/v1/payment-transactions/${transactionUuid}/retry`, {}, options),

  createRefundRequest: (payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse<RefundRequest>>("/payment/v1/refund-requests", payload, options),
};