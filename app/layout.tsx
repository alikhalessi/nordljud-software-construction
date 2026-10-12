import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nordljud — Swedish You Can Use",
  description: "Learn practical Swedish through English, from A2 to C1.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
