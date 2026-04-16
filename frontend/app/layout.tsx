import type { Metadata } from "next";
import { Public_Sans, Manrope, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UpNext | Bionic Listening",
  description: "The real-time collaborative music queue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${manrope.variable} ${sora.variable} h-full antialiased dark`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
      </head>
      <body className="font-body text-on-surface bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
