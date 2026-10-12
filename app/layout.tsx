import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nordljud · Swedish that fits your day",
  description: "Practice Swedish with short missions and a level-aware verb library."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
