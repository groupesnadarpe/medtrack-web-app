import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/application/register-form";

export const metadata: Metadata = {
  title: "Créer un espace",
  description:
    "Déposez une demande de compte institutionnel MEDTRACK-RDC pour votre hôpital, clinique, université ou faculté.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
