import type { Metadata } from "next";
import { Geist_Mono, Manrope, Public_Sans } from "next/font/google";
import "./globals.css";

const fontDisplay = Public_Sans({
  variable: "--font-upnext-display",
  subsets: ["latin"],
});

const fontBody = Manrope({
  variable: "--font-upnext-body",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UpNext — Collaborative Music Queue",
  description: "A real-time collaborative music queue platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable} relative h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
