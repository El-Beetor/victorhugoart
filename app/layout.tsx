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
      <head>
        {/* Preload critical images */}
        <link rel="preload" as="image" href="/FinishedPaintings/bike.png" />
        <link rel="preload" as="image" href="/FinishedPaintings/bird.png" />
        <link rel="preload" as="image" href="/FinishedPaintings/duck.png" />
        <link rel="preload" as="image" href="/FinishedPaintings/lagoon.png" />
        <link rel="preload" as="image" href="/FinishedPaintings/river.png" />
        <link rel="preload" as="image" href="/FinishedPaintings/tree.png" />
        <link rel="preload" as="image" href="/test_new_feature/brushstroke.png" />
        <link rel="preload" as="image" href="/images/victorhugoartlogo.png" />
        <link rel="preload" as="image" href="/images/profile.jpg" />

        {/* Preload sketch images */}
        <link rel="preload" as="image" href="/sketches/image_1.png" />
        <link rel="preload" as="image" href="/sketches/image_3.png" />
        <link rel="preload" as="image" href="/sketches/image_4.png" />
        <link rel="preload" as="image" href="/sketches/image_5.png" />
        <link rel="preload" as="image" href="/sketches/image_6.png" />
        <link rel="preload" as="image" href="/sketches/image_7.png" />
        <link rel="preload" as="image" href="/sketches/image_8.png" />
        <link rel="preload" as="image" href="/sketches/image_9.png" />
        <link rel="preload" as="image" href="/sketches/image_10.png" />
        <link rel="preload" as="image" href="/sketches/image_11.png" />
        <link rel="preload" as="image" href="/sketches/image_12.png" />
        <link rel="preload" as="image" href="/sketches/image_13.png" />
        <link rel="preload" as="image" href="/sketches/image_14.png" />
        <link rel="preload" as="image" href="/sketches/image_15.png" />
        <link rel="preload" as="image" href="/sketches/image_17.png" />
        <link rel="preload" as="image" href="/sketches/image_19.png" />
        <link rel="preload" as="image" href="/sketches/image_21.png" />
      </head>
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
