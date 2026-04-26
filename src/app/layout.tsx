import type { Metadata } from "next";
import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";
import { SmoothScroll } from "@/components/smooth-scroll";

export const metadata: Metadata = {
  title: {
    default: "Portfolio Premium 2026 | Senior Creative Developer",
    template: "%s | Portfolio Premium 2026"
  },
  description:
    "Portfolio ultra-premium pour maisons ambitieuses: direction digitale, interfaces luxe, projets dynamiques et espace client prive.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-premium-2026.vercel.app"
  ),
  applicationName: "Portfolio Premium 2026",
  icons: {
    icon: "/icon"
  },
  openGraph: {
    title: "Portfolio Premium 2026",
    description:
      "Senior Creative Developer pour experiences digitales luxe, projets Cloudinary et espace client Neon.",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Portfolio Premium 2026"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio Premium 2026",
    description:
      "Senior Creative Developer pour experiences digitales luxe, projets dynamiques et espace client prive.",
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
      </body>
    </html>
  );
}
