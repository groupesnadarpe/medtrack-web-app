import type { FieldRule, FormFieldErrors, FormValidationResult } from "@/shared/forms/types";

function isBlank(value: unknown): boolean {
  return value === null || value === undefined || (typeof value === "string" && value.trim() === "");
}

export function required(message = "Ce champ est obligatoire.") {
  return (value: unknown) => (isBlank(value) ? message : null);
}

export function email(message = "L'adresse email n'est pas valide.") {
  return (value: unknown) => {
    if (isBlank(value)) return null;
    return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : message;
  };
}

export function minLength(length: number, message = `Ce champ doit contenir au moins ${length} caractères.`) {
  return (value: unknown) => {
    if (isBlank(value)) return null;
    return typeof value === "string" && value.length >= length ? null : message;
  };
}

export function sameAs<TValues extends Record<string, unknown>>(otherField: keyof TValues & string, message = "Les valeurs ne correspondent pas.") {
  return (value: unknown, values: TValues) => (value === values[otherField] ? null : message);
}

export function createFormValidator<TValues extends Record<string, unknown>>(rules: FieldRule<TValues>[]) {
  return (values: TValues): FormValidationResult<TValues> => {
    const errors: FormFieldErrors<TValues> = {};

    for (const rule of rules) {
      const message = rule.validate(values[rule.field], values);
      if (!message) continue;

      errors[rule.field] = [...(errors[rule.field] ?? []), message];
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
}

export function firstFormFieldError<TValues extends Record<string, unknown>>(errors: FormFieldErrors<TValues>, field: keyof TValues & string) {
  return errors[field]?.[0];
}