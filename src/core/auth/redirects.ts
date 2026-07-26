const internalPathPattern = /^\/[A-Za-z0-9/_?=&.-]*$/;

// Empêche les open redirects : on ne redirige jamais vers une URL externe fournie par query string.
export function safeRedirectPath(value: string | null | undefined, fallback = "/"): string {
  if (!value || !internalPathPattern.test(value) || value.startsWith("//")) {
    return fallback;
  }

  return value;
}