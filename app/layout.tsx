import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clarity",
  description: "Design with intention. Build with intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
