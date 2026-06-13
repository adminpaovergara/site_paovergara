import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/app/components/PwaRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pao Vergara | Color Grading & Finishing",
  description: "Color grading and finishing for commercials, fashion, music and fiction.",
  metadataBase: new URL("https://paovergara.com"),
  applicationName: "Pao Vergara",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pao Admin"
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    title: "Pao Vergara | Color Grading & Finishing",
    description: "Color grading and finishing for commercials, fashion, music and fiction.",
    url: "https://paovergara.com",
    siteName: "Pao Vergara",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Pao Vergara | Color Grading & Finishing"
      }
    ],
    locale: "es_EC",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Pao Vergara | Color Grading & Finishing",
    description: "Color grading and finishing for commercials, fashion, music and fiction.",
    images: ["/opengraph-image"]
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111111"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
