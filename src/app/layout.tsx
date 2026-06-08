import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";



export const metadata: Metadata = {
  title: "takoyaki-link",
  description: "My link collection site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
