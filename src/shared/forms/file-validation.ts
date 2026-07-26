const excelMimeTypes = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
]);

const excelExtensions = [".xlsx", ".xls", ".csv"];

export function validateSpreadsheetFile(file: File, maxSizeInBytes = 10 * 1024 * 1024): string | null {
  if (file.size > maxSizeInBytes) {
    return "Le fichier est trop volumineux.";
  }

  const lowerName = file.name.toLowerCase();
  const hasAllowedExtension = excelExtensions.some((extension) => lowerName.endsWith(extension));

  // On valide MIME + extension côté client pour guider l'utilisateur ; le Back-end reste l'autorité de sécurité.
  if (!excelMimeTypes.has(file.type) && !hasAllowedExtension) {
    return "Le fichier doit être un tableur Excel ou CSV.";
  }

  return null;
}