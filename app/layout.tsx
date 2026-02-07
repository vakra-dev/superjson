import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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
  title: "superjson.dev - The Fastest JSON Explorer",
  description:
    "A beautiful, fast, keyboard-driven JSON explorer. Open source, no tracking, 13 themes. Built for developers.",
  keywords: ["JSON", "explorer", "viewer", "developer tools", "open source"],
  authors: [{ name: "superjson.dev" }],
  openGraph: {
    title: "superjson.dev",
    description: "The fastest JSON explorer. No noise. Just JSON.",
    url: "https://superjson.dev",
    siteName: "superjson.dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "superjson.dev",
    description: "The fastest JSON explorer. No noise. Just JSON.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
