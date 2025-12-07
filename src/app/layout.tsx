import type { Metadata } from "next";
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
      </body>
    </html>
  );
}
