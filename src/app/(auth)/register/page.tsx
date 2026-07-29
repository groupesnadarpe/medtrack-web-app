import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/application/register-form";

export const metadata: Metadata = {
  title: "Créer un espace",
  description:
    "Déposez votre demande d'inscription MEDTRACK-RDC : vérifiez votre éligibilité auprès de votre université puis créez votre compte étudiant.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
