// Toute configuration exposée au navigateur doit être préfixée NEXT_PUBLIC_.
// Les secrets et signatures Gateway restent exclusivement côté serveur, Kong et services Laravel.
export const env = {
  apiBaseUrl:
    process.env.MEDTRACK_API_BASE_URL ??
    process.env.NEXT_PUBLIC_MEDTRACK_API_BASE_URL ??
    "https://localhost/api",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Medtrack",
  isProduction: process.env.NODE_ENV === "production",

  // Les mocks sont désormais opt-in : l'API réelle est utilisée par défaut.
  useMocks: (process.env.NEXT_PUBLIC_USE_MOCKS ?? "false") === "true",

  // Les gardes sont actifs par défaut et ne peuvent être neutralisés que volontairement en local.
  enforceRouteGuard: (process.env.NEXT_PUBLIC_ENFORCE_ROUTE_GUARD ?? "true") !== "false",
};