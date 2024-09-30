import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import NavBarComponent from "@/components/navbar/NavBar";
import Notification from "@/components/navbar/Notification";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Lightning Moshi",
  description:
    "Lightning Moshi is a platform to talk with a speech-to-speech model moshi. Moshi is created by 'kyutai org'. This projects uses a litserve fork to support grpc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {" "}
        <NextUIProvider>
          <Notification />
          <NavBarComponent />
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}
