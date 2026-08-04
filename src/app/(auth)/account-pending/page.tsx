import type { Metadata } from "next";
import { AccountPendingStatus } from "@/features/auth/application/account-pending-status";

export const metadata: Metadata = {
  title: "Demande envoyée",
  description: "Confirmation de votre demande de compte institutionnel Medtrack.",
};

export default function AccountPendingPage() {
  return <AccountPendingStatus />;
}