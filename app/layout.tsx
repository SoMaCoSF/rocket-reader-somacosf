import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RRS · Rocket Reader SomaCoSF",
  description: "Reverse RSS — UUIDv8 provenance speed-read explanations for every file",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
