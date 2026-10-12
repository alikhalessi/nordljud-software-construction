import type { Metadata } from "next";
import "./style.css";

export const metadata: Metadata = {
  title: "Nordljud | Practise Swedish with purpose",
  description: "Four levels, practical Swedish, 456 verbs and useful listening exercises"
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
