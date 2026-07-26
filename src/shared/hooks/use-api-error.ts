"use client";

import { useMemo, useState } from "react";
import { mapApiError } from "@/core/errors/api-error-mapper";
import type { AppErrorView } from "@/core/errors/app-error";

export function useApiError() {
  const [error, setError] = useState<AppErrorView | null>(null);

  return useMemo(
    () => ({
      error,
      clearError: () => setError(null),
      captureError: (unknownError: unknown) => {
        const mapped = mapApiError(unknownError);
        setError(mapped);
        return mapped;
      },
    }),
    [error],
  );
}