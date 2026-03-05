/**
 * @fileoverview Root layout component for the Aesthetic Mode application.
 */

import "./globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Aesthetic Mode - UK Fashion Events",
  description: "Discover premium fashion events across the UK",
  openGraph: {
    title: "Aesthetic Mode",
    description: "Curated UK Fashion Events",
    url: "https://aesthetic-mode.co.uk",
    siteName: "Aesthetic Mode",
    images: [
      {
        url: "https://images.unsplash.com/photo-1672137233327-37b0c1049e77?q=80&w=1200&h=630&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Aesthetic Mode Editorial Fashion",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
