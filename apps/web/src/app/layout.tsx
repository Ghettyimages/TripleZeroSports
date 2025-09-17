import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Triple Zero Sports",
  description: "Sports news, culture, and analysis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}