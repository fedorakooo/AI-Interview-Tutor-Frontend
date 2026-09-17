import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "AI Interview Tutor",
    template: "%s · AI Interview Tutor",
  },
  description:
    "Practice realistic AI interviews, upload your CV, and turn feedback into focused practice plans.",
  applicationName: "AI Interview Tutor",
  keywords: [
    "AI interview",
    "mock interview",
    "CV analysis",
    "system design practice",
    "behavioral interview",
    "job description matcher",
  ],
  openGraph: {
    title: "AI Interview Tutor",
    description:
      "CV-aware mock interviews, actionable reports, and practice plans for serious candidates.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Interview Tutor",
    description: "Practice interviews with AI-powered feedback.",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
