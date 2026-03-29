import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommandPalette } from "@/components/common/CommandPalette";

const fontSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "DevDeck - Developer Utility Hub",
  description:
    "Fast, clean developer utilities — all in one place. JSON formatter, JWT decoder, regex tester, and more. All processing happens in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background">
        <Providers>
          <Navbar />
          <main className="relative flex-1">
            <div
              className="pointer-events-none absolute inset-0 -z-10 bg-app-mesh"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 -z-10 bg-grid-fade"
              aria-hidden
            />
            <div className="relative z-0">{children}</div>
          </main>
          <Footer />
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}
