import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const _inter = Inter({ subsets: ["latin"] });
const _plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "MEDTRACK-RDC — Plateforme de gestion des stages médicaux",
    template: "%s | MEDTRACK-RDC",
  },
  description:
    "Supervisez, validez et optimisez le parcours clinique des futurs professionnels de santé de la République Démocratique du Congo.",
};

export const viewport: Viewport = {
  themeColor: "#16264a",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="bg-background">
      <body className="font-sans text-foreground antialiased">{children}</body>
    </html>
  );
}
