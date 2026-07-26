import { normalizeFieldErrors } from "@/core/errors/api-error-mapper";
import type { ApiProblem } from "@/core/api/api-error";
import type { FormFieldErrors } from "@/shared/forms/types";

export function mapLaravelValidationErrors<TValues extends Record<string, unknown>>(problem?: ApiProblem): FormFieldErrors<TValues> {
  return normalizeFieldErrors(problem?.errors) as FormFieldErrors<TValues>;
}

export function mergeFormErrors<TValues extends Record<string, unknown>>(
  clientErrors: FormFieldErrors<TValues>,
  serverErrors: FormFieldErrors<TValues>,
): FormFieldErrors<TValues> {
  return {
    ...clientErrors,
    ...serverErrors,
  };
}