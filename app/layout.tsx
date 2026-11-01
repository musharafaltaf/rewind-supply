import type { Metadata } from "next";

import "./globals.css";

import ClientShell from "./ClientShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://rewindsupply.online"),

  title: {
    default: "Rewind Supply | Online Store",
    template: "%s | Rewind Supply",
  },

  description:
    "Discover Rewind Supply. Explore our latest collections, discover unique styles and shop online.",

  applicationName: "Rewind Supply",

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Rewind Supply | Online Store",
    description:
      "Discover Rewind Supply. Explore our latest collections and shop online.",
    url: "https://rewindsupply.online",
    siteName: "Rewind Supply",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        alt: "Rewind Supply Logo",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Rewind Supply | Online Store",
    description:
      "Discover Rewind Supply. Explore our latest collections and shop online.",
    images: ["/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}