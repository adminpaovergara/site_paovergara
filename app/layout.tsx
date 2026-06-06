import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pao Vergara | Color Grading & Finishing",
  description:
    "Colorist and finishing artist for commercials, fashion, music videos and fiction. Based in Ecuador, working internationally.",
  metadataBase: new URL("https://paovergara.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
