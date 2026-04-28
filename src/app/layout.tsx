import type { Metadata } from "next";
import "./globals.css";
import { CommandMenu } from "@/components/command-menu";
import { MotionProvider } from "@/components/motion-provider";
import { SmoothScroll } from "@/components/smooth-scroll";

export const metadata: Metadata = {
  title: {
    default: "ANTIDZN | Direction Artistique & Systèmes Visuels",
    template: "%s | ANTIDZN"
  },
  description:
    "Conception d'identités à fort caractère. Spécialisé en 3D (C4D) et branding de communautés digitales. Basé en France.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-premium-2026.vercel.app"
  ),
  applicationName: "ANTIDZN",
  icons: {
    icon: "/icon"
  },
  openGraph: {
    title: "ANTIDZN — Direction Artistique & Systèmes Visuels",
    description:
      "Conception d'identités à fort caractère. 3D, C4D et branding de communautés digitales.",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ANTIDZN"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ANTIDZN — Direction Artistique & Systèmes Visuels",
    description:
      "Conception d'identités à fort caractère. Spécialisé en 3D (C4D) et branding de communautés digitales.",
    images: ["/opengraph-image"]
  }
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
        <MotionProvider>{children}</MotionProvider>
        <CommandMenu />
        <div className="site-noise" aria-hidden="true" />
      </body>
    </html>
  );
}
