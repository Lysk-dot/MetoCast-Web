import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import MetricsTracker from "@/components/MetricsTracker";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico?v=1' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico?v=1',
    apple: '/favicon.ico?v=1',
  },
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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('metocast-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <MetricsTracker />
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

