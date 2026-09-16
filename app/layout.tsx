import type { Metadata, Viewport } from "next";
import { weddingData } from "@/data/wedding";
import { asset } from "@/lib/assets";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#5B0F22",
};

export const metadata: Metadata = {
  title: `دعوة زفاف عبدالرحمن وريم`,
  description: "دعوة زفاف عبدالرحمن وريم",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className=""
      style={{
        background: "#5B0F22",
        ["--tex-paper" as string]: `url("${asset("/textures/paper-plain.png")}")`,
        ["--tex-envelope" as string]: `url("${asset("/textures/envelope-closed.png")}")`,
        ["--tex-burgundy" as string]: `url("${asset("/textures/burgundy.png")}")`,
        ["--tex-botanical" as string]: `url("${asset("/textures/envelope-botanical.png")}")`,
        ["--tex-end" as string]: `url("${asset("/textures/end-botanical.png")}")`,
        ["--tex-grain" as string]: `url("${asset("/textures/grain.png")}")`,
      }}
    >
      <body style={{ background: "#5B0F22", margin: 0 }}>{children}</body>
    </html>
  );
}
