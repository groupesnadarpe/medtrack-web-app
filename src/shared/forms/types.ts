export type FormFieldErrors<TValues extends Record<string, unknown>> = Partial<Record<keyof TValues | string, string[]>>;

export type FormValidationResult<TValues extends Record<string, unknown>> = {
  isValid: boolean;
  errors: FormFieldErrors<TValues>;
};

export type FormValidator<TValues extends Record<string, unknown>> = (values: TValues) => FormValidationResult<TValues>;

export type FieldRule<TValues extends Record<string, unknown>> = {
  field: keyof TValues & string;
  validate: (value: TValues[keyof TValues], values: TValues) => string | null;
};