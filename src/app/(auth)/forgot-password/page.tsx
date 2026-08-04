import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/application/password-recovery-forms";

export const metadata: Metadata = { title: "Mot de passe oublié", description: "Demandez la réinitialisation sécurisée de votre mot de passe Medtrack." };
export default function ForgotPasswordPage() { return <ForgotPasswordForm />; }