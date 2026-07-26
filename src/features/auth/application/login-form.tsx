"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type LoginState = {
  loading: boolean;
  error?: string;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<LoginState>({ loading: false });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true });

    const formData = new FormData(event.currentTarget);
    const redirect = searchParams.get("redirect");
    const endpoint = redirect ? `/api/auth/login?redirect=${encodeURIComponent(redirect)}` : "/api/auth/login";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        login: String(formData.get("login") ?? ""),
        password: String(formData.get("password") ?? ""),
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setState({
        loading: false,
        error: payload?.detail ?? payload?.message ?? payload?.title ?? "Identifiants invalides.",
      });

      return;
    }

    const redirectTo = payload?.data?.redirect_to ?? "/";
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-sm text-slate-200">Email, téléphone ou matricule</span>
        <input
          name="login"
          required
          className="mt-2 w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-slate-950 outline-none"
          autoComplete="username"
        />
      </label>
      <label className="block">
        <span className="text-sm text-slate-200">Mot de passe</span>
        <input
          name="password"
          type="password"
          required
          className="mt-2 w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-slate-950 outline-none"
          autoComplete="current-password"
        />
      </label>
      {state.error ? <p className="rounded-xl bg-red-500/15 p-3 text-sm text-red-100">{state.error}</p> : null}
      <button
        type="submit"
        disabled={state.loading}
        className="w-full rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 disabled:opacity-60"
      >
        {state.loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}