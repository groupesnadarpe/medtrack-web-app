// Toute configuration exposée au navigateur doit être préfixée NEXT_PUBLIC_.
// Les secrets, clés privées et signatures Gateway restent exclusivement côté Back-end/Kong.
export const env = {
  apiBaseUrl:
    process.env.MEDTRACK_API_BASE_URL ??
    process.env.NEXT_PUBLIC_MEDTRACK_API_BASE_URL ??
    "https://localhost/api",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Medtrack",
  isProduction: process.env.NODE_ENV === "production",
};