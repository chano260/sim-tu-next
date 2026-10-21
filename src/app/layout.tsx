import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "SIM-TU SMA Negeri 3 Buru | Sistem Informasi Tata Usaha",
  description: "Aplikasi Tata Usaha, E-Office Persuratan, dan Generator SKL & Transkrip Nilai SMA Negeri 3 Buru",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased print:h-auto print:block`}
    >
      <body className="min-h-full flex flex-col print:block print:min-h-0 print:h-auto">{children}</body>
    </html>
  );
}
