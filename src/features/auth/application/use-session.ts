"use client";

import { useEffect, useState } from "react";
import type { AuthUser } from "@/features/auth/domain/auth-user";

type SessionState =
  | { loading: true; authenticated: false; user: null; defaultPath: null }
  | { loading: false; authenticated: false; user: null; defaultPath: null }
  | { loading: false; authenticated: true; user: AuthUser; defaultPath: string | null };

// Hook léger pour les composants client qui doivent connaître l'utilisateur courant.
// Les gardes critiques restent côté serveur avec requireAuth/requireActorAccess.
export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({
    loading: true,
    authenticated: false,
    user: null,
    defaultPath: null,
  });

  useEffect(() => {
    let active = true;

    fetch("/api/auth/session", { headers: { Accept: "application/json" } })
      .then((response) => response.json())
      .then((payload) => {
        if (!active) {
          return;
        }

        setState({
          loading: false,
          authenticated: Boolean(payload?.data?.authenticated),
          user: payload?.data?.user ?? null,
          defaultPath: payload?.data?.default_path ?? null,
        } as SessionState);
      })
      .catch(() => {
        if (active) {
          setState({ loading: false, authenticated: false, user: null, defaultPath: null });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}