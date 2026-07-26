type FormDataPrimitive = string | number | boolean | Date | Blob | File;
type FormDataValue = FormDataPrimitive | FormDataPrimitive[] | Record<string, unknown> | null | undefined;

export type FormDataPayload = Record<string, FormDataValue>;

function appendValue(formData: FormData, key: string, value: FormDataValue): void {
  if (value === null || value === undefined) return;

  if (Array.isArray(value)) {
    for (const item of value) {
      appendValue(formData, `${key}[]`, item);
    }
    return;
  }

  if (value instanceof Date) {
    formData.append(key, value.toISOString());
    return;
  }

  if (typeof File !== "undefined" && value instanceof File) {
    formData.append(key, value, value.name);
    return;
  }

  if (typeof Blob !== "undefined" && value instanceof Blob) {
    formData.append(key, value);
    return;
  }

  if (typeof value === "object") {
    // Les objets imbriqués sont sérialisés explicitement pour éviter des conversions implicites ambiguës.
    formData.append(key, JSON.stringify(value));
    return;
  }

  formData.append(key, String(value));
}

export function objectToFormData(payload: FormDataPayload): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    appendValue(formData, key, value);
  }

  return formData;
}

export function spreadsheetFileToFormData(file: File): FormData {
  return objectToFormData({ file });
}