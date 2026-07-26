export type MediaFile = {
  uuid: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  status: "CREATED" | "READY" | "ARCHIVED" | "FAILED";
  downloadUrl?: string | null;
};

// Pour l'extraction Excel, le front manipule surtout les lignes extraites,
// pas tout le modèle interne media-service.
export type ExtractedStudentRow = {
  lastName: string;
  middleName?: string | null;
  firstName: string;
  gender: "MALE" | "FEMALE" | string;
  birthDate?: string | null;
  matriculeNumber: string;
};
