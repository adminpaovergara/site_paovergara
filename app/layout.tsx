import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pao Vergara | Color Grading & Finishing",
  description: "Color grading and finishing for commercials, fashion, music and fiction.",
  metadataBase: new URL("https://paovergara.com"),
  alternates: {
    canonical: "/"
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
