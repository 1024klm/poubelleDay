import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PoubelleDay - Ne ratez plus jamais vos jours de poubelles",
  description: "Convertissez facilement vos calendriers PDF de collecte des déchets en fichiers .ics importables dans tous vos calendriers numériques.",
  keywords: "calendrier déchets, collecte ordures, poubelles, ics, rappels, tri sélectif",
  authors: [{ name: "PoubelleDay" }],
  openGraph: {
    title: "PoubelleDay - Ne ratez plus jamais vos jours de poubelles",
    description: "Convertissez vos calendriers PDF de collecte en rappels automatiques",
    type: "website",
    locale: "fr_FR",
    url: "https://poubelleday.com",
    siteName: "PoubelleDay",
  },
  twitter: {
    card: "summary_large_image",
    title: "PoubelleDay",
    description: "Ne ratez plus jamais vos jours de poubelles",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
