import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/application/login-form";
import { AuthHeroPanel } from "@/features/auth/ui/auth-hero-panel";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à MEDTRACK-RDC pour accéder à votre espace de gestion des stages médicaux.",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <AuthHeroPanel />

      <section className="flex flex-col items-center justify-center gap-10 px-6 py-12 sm:px-10 lg:py-16">
        <Suspense
          fallback={
            <div className="h-[520px] w-full max-w-md animate-pulse rounded-3xl border border-border/70 bg-muted/60" />
          }
        >
          <LoginForm />
        </Suspense>

        <p className="text-center text-sm text-muted-foreground">
          Copyright © {new Date().getFullYear()} MEDTRACK-RDC.
        </p>
      </section>
    </main>
  );
}
