import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";

export const metadata: Metadata = {
  title: "Portfolio Premium 2026",
  description:
    "Portfolio ultra-premium pour experience digitale luxe, projets dynamiques et espace client prive.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-premium-2026.vercel.app"
  )
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
