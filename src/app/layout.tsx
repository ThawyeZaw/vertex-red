// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
<<<<<<< HEAD
import { Navbar } from "@/components/Navbar";
=======

import { MainNavbar } from "@/components/layout/MainNavbar";

>>>>>>> TZ
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LifeLink",
    template: "%s | LifeLink",
  },
  description:
    "Myanmar emergency blood donation and hospital coordination network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F3F5F9] antialiased`}>
        <MainNavbar />

        {children}
        <Navbar />
      </body>
    </html>
  );
}
