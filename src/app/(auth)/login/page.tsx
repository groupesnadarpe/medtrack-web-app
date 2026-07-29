import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/application/login-form";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à MEDTRACK-RDC pour accéder à votre espace de gestion des stages médicaux.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="h-[520px] w-full animate-pulse rounded-3xl border border-border/70 bg-muted/60" />}
    >
      <LoginForm />
    </Suspense>
  );
}
