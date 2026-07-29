import type { Metadata } from "next";
import { InstitutionRegistrationForm } from "@/features/institutions/application/institution-registration-form";

export const metadata: Metadata = {
  title: "Demande de compte institutionnel",
  description:
    "Déposez la demande d'inscription de votre hôpital, clinique, université ou faculté sur MEDTRACK-RDC : vous en deviendrez l'administrateur après validation.",
};

export default function InstitutionRegisterPage() {
  return <InstitutionRegistrationForm />;
}
