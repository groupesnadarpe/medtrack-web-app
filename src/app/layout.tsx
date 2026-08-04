import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// La police est embarquée dans l'application : aucun appel à Google Fonts
// n'est nécessaire pendant le build ou au démarrage du conteneur.
const openSans = localFont({
  src: [
    { path: "../assets/fonts/OpenSans-Light.ttf", weight: "300", style: "normal" },
    { path: "../assets/fonts/OpenSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/fonts/OpenSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-open-sans",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

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
    <html lang="fr" className={`${openSans.variable} bg-background`}>
      <body className="font-sans text-foreground antialiased">{children}</body>
    </html>
  );
}