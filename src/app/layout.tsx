import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Daryl Blancaflor",
  description: "Fullstack Developer",
  icons: [{ rel: "icon", url: "/images/logo-circle.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <ClerkProvider>
          <Providers>
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
