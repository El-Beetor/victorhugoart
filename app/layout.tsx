import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ColorProvider } from "./context/ColorContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "vicgarcia.art - Artist Portfolio",
  description: "Victor Garcia Art - Explore original paintings, sketches, and artwork. Browse my portfolio of nature and landscape art, shop original pieces, or check out my sketchbook.",
  keywords: ["art", "artist", "paintings", "portfolio", "Victor Garcia", "artwork", "original art", "sketchbook"],
  authors: [{ name: "Victor Garcia" }],
  openGraph: {
    title: "vicgarcia.art - Artist Portfolio",
    description: "Explore original paintings, sketches, and artwork by Victor Garcia",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ColorProvider>
          {children}
        </ColorProvider>
      </body>
    </html>
  );
}
