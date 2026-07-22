import type { Metadata, Viewport } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import GlobalSearch from "@/components/GlobalSearch";
const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Avenpath",
    default: "Avenpath | A Comprehensive Educational Platform"
  },
  description: "Knowledge, organized beautifully.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans font-medium text-foreground bg-background selection:bg-primary/20 selection:text-primary overflow-x-hidden">
        <GlobalSearch />
        {children}
        <Toaster position="bottom-right" theme="system" />
      </body>
    </html>
  );
}
