import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medtrack",
  description: "Plateforme Medtrack de gestion des stages médicaux.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
