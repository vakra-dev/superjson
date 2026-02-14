import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { PromoBanner } from "@/components/ui/PromoBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "superjson - Simple, beautiful JSON",
  description:
    "A keyboard driven JSON explorer. Simple, beautiful, fast. Vim style navigation, beautiful themes, smart search, share links. Open source, zero tracking.",
  keywords: [
    "JSON",
    "explorer",
    "viewer",
    "editor",
    "formatter",
    "validator",
    "developer tools",
    "open source",
  ],
  authors: [{ name: "Nihal", url: "https://github.com/nihalwashere" }],
  metadataBase: new URL("https://superjson.dev"),
  openGraph: {
    title: "superjson",
    description: "A keyboard driven JSON explorer. Simple, beautiful, fast.",
    url: "https://superjson.dev",
    siteName: "superjson",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "superjson",
    description: "A keyboard driven JSON explorer. Simple, beautiful, fast.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <PromoBanner />
        {children}
      </body>
    </html>
  );
}
