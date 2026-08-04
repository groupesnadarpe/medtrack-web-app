import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/application/password-recovery-forms";

export const metadata: Metadata = { title: "Réinitialiser le mot de passe", description: "Définissez un nouveau mot de passe pour votre compte Medtrack." };
export default function ResetPasswordPage() {
  return <Suspense fallback={<div className="h-[520px] animate-pulse rounded-3xl bg-muted/60" />}><ResetPasswordForm /></Suspense>;
}