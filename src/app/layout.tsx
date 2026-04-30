import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EnergyBae AutoLoad AI | Strategic Energy Intelligence",
  description: "Enterprise-grade Agentic Energy Auditing and ROI Analysis platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrains.variable} h-full antialiased selection:bg-blue-500/30`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#020617] text-slate-100">{children}</body>
    </html>
  );
}
