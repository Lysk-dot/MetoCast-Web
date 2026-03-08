import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MetôCast — Podcast Metodista",
    template: "%s | MetôCast",
  },
  description:
    "Podcast criado por estudantes da Universidade Metodista para discutir educação, vida universitária, cultura e temas sociais relevantes.",
  keywords: ["podcast", "metodista", "universidade", "educação", "metocast"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "MetôCast",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
