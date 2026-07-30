import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "Secure MUCYORA Authentication",
    template: "%s | MUCYORA",
  },
  description:
    "Secure authentication for verified device ownership and trusted MUCYORA services.",
  applicationName: "MUCYORA",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#1B4EF5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
