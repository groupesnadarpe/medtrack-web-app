// Toute configuration exposée au navigateur doit être préfixée NEXT_PUBLIC_.
// Les secrets, clés privées et signatures Gateway restent exclusivement côté Back-end/Kong.
export const env = {
  apiBaseUrl:
    process.env.MEDTRACK_API_BASE_URL ??
    process.env.NEXT_PUBLIC_MEDTRACK_API_BASE_URL ??
    "https://localhost/api",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Medtrack",
  isProduction: process.env.NODE_ENV === "production",

  // Phase UI : les écrans sont alimentés par des données mockées calquées sur l'OpenAPI.
  // Passer NEXT_PUBLIC_USE_MOCKS=false rebranche automatiquement les gateways sur l'API réelle.
  useMocks: (process.env.NEXT_PUBLIC_USE_MOCKS ?? "true") !== "false",

  // Tant que le back-end n'est pas joignable, le middleware laisse passer les espaces acteurs.
  // Passer NEXT_PUBLIC_ENFORCE_ROUTE_GUARD=true réactive la protection sans changer de code.
  enforceRouteGuard: (process.env.NEXT_PUBLIC_ENFORCE_ROUTE_GUARD ?? "false") === "true",
};
