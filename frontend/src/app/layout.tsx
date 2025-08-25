import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OnchainMind - AI-Powered Onchain Identity & SocialFi",
  description: "Create your AI Twin NFT, build reputation through social interactions, and join exclusive circles on Circle Layer blockchain.",
  keywords: ["blockchain", "AI", "NFT", "identity", "social", "reputation", "circles", "Circle Layer"],
  authors: [{ name: "OnchainMind Team" }],
  openGraph: {
    title: "OnchainMind - AI-Powered Onchain Identity & SocialFi",
    description: "Create your AI Twin NFT, build reputation through social interactions, and join exclusive circles on Circle Layer blockchain.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnchainMind - AI-Powered Onchain Identity & SocialFi",
    description: "Create your AI Twin NFT, build reputation through social interactions, and join exclusive circles on Circle Layer blockchain.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}