import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Poppins, Caveat, Special_Elite, Courier_Prime, Cutive_Mono } from "next/font/google";
import "./globals.css";
import { ColorProvider } from "./context/ColorContext";
import DebugPanel from "./components/DebugPanel";
import theme from "./config/theme.json";

const FONT_VARS: Record<string, string> = {
  geist: "var(--font-geist-sans)",
  playfair: "var(--font-playfair)",
  poppins: "var(--font-poppins)",
  caveat: "var(--font-caveat)",
  specialElite: "var(--font-special-elite)",
  courierPrime: "var(--font-courier-prime)",
  cutiveMono: "var(--font-cutive-mono)",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const specialElite = Special_Elite({
  variable: "--font-special-elite",
  subsets: ["latin"],
  weight: ["400"],
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const cutiveMono = Cutive_Mono({
  variable: "--font-cutive-mono",
  subsets: ["latin"],
  weight: ["400"],
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
        {/* Preload hero painting candidates (small files only) */}
        <link rel="preload" as="image" href="/FinishedPaintings/bike.jpg" />
        <link rel="preload" as="image" href="/FinishedPaintings/bird.jpg" />
        <link rel="preload" as="image" href="/FinishedPaintings/tree.jpg" />
        <link rel="preload" as="image" href="/FinishedPaintings/bar.jpg" />
        <link rel="preload" as="image" href="/FinishedPaintings/sheep.jpg" />
        <link rel="preload" as="image" href="/test_new_feature/brushstroke.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${poppins.variable} ${caveat.variable} ${specialElite.variable} ${courierPrime.variable} ${cutiveMono.variable} antialiased`}
        style={{ '--font-active': FONT_VARS[theme.font] || FONT_VARS.geist } as React.CSSProperties}
      >
        <ColorProvider>
          {children}
          <DebugPanel />
        </ColorProvider>
      </body>
    </html>
  );
}
