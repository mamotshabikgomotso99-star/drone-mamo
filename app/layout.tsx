import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const viewport: Viewport = {
  themeColor: "#05080a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KM Drone Services — Precision Agricultural Drones in South Africa",
    template: "%s | KM Drone Services",
  },
  description:
    "Premium agricultural drone services for South African farmers — crop spraying, fertilizer & pesticide application, mapping, crop monitoring, and aerial media. Operator-led, data-backed.",
  keywords: [
    "agricultural drone South Africa",
    "drone spraying South Africa",
    "crop spraying drone",
    "precision agriculture SA",
    "farm drone services",
    "drone mapping agriculture",
    "fertilizer application drone",
    "crop monitoring drone",
  ],
  authors: [{ name: "KM Drone Services" }],
  creator: "KM Drone Services",
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteUrl,
    siteName: "KM Drone Services",
    title: "KM Drone Services — Precision Agricultural Drones in South Africa",
    description:
      "Premium agricultural drone services for South African farmers. Spray, monitor, map, and protect.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "KM Drone Services — Precision Agriculture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KM Drone Services",
    description: "Precision agricultural drone services in South Africa.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: siteUrl },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen bg-ink text-white">
        <Suspense>
          <ToastProvider>{children}</ToastProvider>
        </Suspense>
      </body>
    </html>
  );
}
