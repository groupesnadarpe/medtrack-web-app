"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);

    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { Accept: "application/json" },
    }).catch(() => null);

    router.replace("/auth/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="rounded-full border px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
    >
      {loading ? "Déconnexion..." : "Se déconnecter"}
    </button>
  );
}